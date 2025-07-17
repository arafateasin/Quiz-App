// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract QuizToken is ERC20, Ownable {
    constructor() ERC20("QuizToken", "QUIZ") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M tokens
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

contract AIQuizApp is ReentrancyGuard, Pausable, Ownable {
    QuizToken public quizToken;
    
    struct Question {
        string question;
        string[] options;
        uint256 correctAnswerIndex;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isRevealed;
        uint256 totalParticipants;
        uint256 correctAnswers;
    }
    
    struct UserAnswer {
        uint256 answerIndex;
        bool hasAnswered;
        bool isCorrect;
    }
    
    struct PlayerStats {
        uint256 totalQuestions;
        uint256 correctAnswers;
        uint256 totalRewards;
        uint256 currentStreak;
        uint256 bestStreak;
    }
    
    mapping(uint256 => Question) public questions;
    mapping(uint256 => mapping(address => UserAnswer)) public userAnswers;
    mapping(address => PlayerStats) public playerStats;
    
    uint256 public currentQuestionId;
    uint256 public constant QUESTION_DURATION = 30 seconds;
    uint256 public constant REWARD_AMOUNT = 10 * 10**18; // 10 tokens
    uint256 public totalQuestionsCount;
    
    address[] public leaderboard;
    mapping(address => uint256) public leaderboardIndex;
    
    event QuestionCreated(uint256 indexed questionId, string question, uint256 startTime, uint256 endTime);
    event AnswerSubmitted(uint256 indexed questionId, address indexed player, uint256 answerIndex);
    event QuestionRevealed(uint256 indexed questionId, uint256 correctAnswer, uint256 totalParticipants, uint256 correctAnswers);
    event RewardDistributed(address indexed player, uint256 amount);
    event LeaderboardUpdated(address indexed player, uint256 newScore);
    
    modifier onlyDuringQuestion(uint256 questionId) {
        require(questions[questionId].isActive, "Question is not active");
        require(block.timestamp <= questions[questionId].endTime, "Question time has expired");
        _;
    }
    
    modifier hasNotAnswered(uint256 questionId) {
        require(!userAnswers[questionId][msg.sender].hasAnswered, "Already answered this question");
        _;
    }
    
    constructor(address _quizToken) Ownable(msg.sender) {
        quizToken = QuizToken(_quizToken);
        currentQuestionId = 0;
        totalQuestionsCount = 0;
    }
    
    function createQuestion(
        string memory _question,
        string[] memory _options,
        uint256 _correctAnswerIndex
    ) external onlyOwner {
        require(_options.length >= 2 && _options.length <= 6, "Invalid number of options");
        require(_correctAnswerIndex < _options.length, "Invalid correct answer index");
        
        uint256 questionId = totalQuestionsCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + QUESTION_DURATION;
        
        questions[questionId] = Question({
            question: _question,
            options: _options,
            correctAnswerIndex: _correctAnswerIndex,
            startTime: startTime,
            endTime: endTime,
            isActive: true,
            isRevealed: false,
            totalParticipants: 0,
            correctAnswers: 0
        });
        
        currentQuestionId = questionId;
        
        emit QuestionCreated(questionId, _question, startTime, endTime);
    }
    
    function submitAnswer(uint256 questionId, uint256 answerIndex) 
        external 
        whenNotPaused
        onlyDuringQuestion(questionId)
        hasNotAnswered(questionId)
        nonReentrant
    {
        require(answerIndex < questions[questionId].options.length, "Invalid answer index");
        
        userAnswers[questionId][msg.sender] = UserAnswer({
            answerIndex: answerIndex,
            hasAnswered: true,
            isCorrect: false // Will be set when question is revealed
        });
        
        questions[questionId].totalParticipants++;
        
        // Update player stats
        playerStats[msg.sender].totalQuestions++;
        
        // Add to leaderboard if not already there
        if (leaderboardIndex[msg.sender] == 0 && (leaderboard.length == 0 || leaderboard[0] != msg.sender)) {
            leaderboard.push(msg.sender);
            leaderboardIndex[msg.sender] = leaderboard.length;
        }
        
        emit AnswerSubmitted(questionId, msg.sender, answerIndex);
    }
    
    function revealAnswer(uint256 questionId) external onlyOwner {
        require(questions[questionId].isActive, "Question is not active");
        require(block.timestamp > questions[questionId].endTime, "Question time has not expired");
        require(!questions[questionId].isRevealed, "Answer already revealed");
        
        questions[questionId].isActive = false;
        questions[questionId].isRevealed = true;
        
        // Process all answers and distribute rewards
        _processAnswersAndDistributeRewards(questionId);
        
        emit QuestionRevealed(
            questionId,
            questions[questionId].correctAnswerIndex,
            questions[questionId].totalParticipants,
            questions[questionId].correctAnswers
        );
    }
    
    function _processAnswersAndDistributeRewards(uint256 questionId) internal {
        uint256 correctAnswerIndex = questions[questionId].correctAnswerIndex;
        uint256 correctCount = 0;
        
        // First pass: count correct answers
        for (uint256 i = 0; i < leaderboard.length; i++) {
            address player = leaderboard[i];
            if (userAnswers[questionId][player].hasAnswered) {
                if (userAnswers[questionId][player].answerIndex == correctAnswerIndex) {
                    correctCount++;
                    userAnswers[questionId][player].isCorrect = true;
                }
            }
        }
        
        questions[questionId].correctAnswers = correctCount;
        
        // Second pass: distribute rewards and update stats
        for (uint256 i = 0; i < leaderboard.length; i++) {
            address player = leaderboard[i];
            if (userAnswers[questionId][player].hasAnswered && userAnswers[questionId][player].isCorrect) {
                // Distribute reward
                quizToken.transfer(player, REWARD_AMOUNT);
                
                // Update player stats
                playerStats[player].correctAnswers++;
                playerStats[player].totalRewards += REWARD_AMOUNT;
                playerStats[player].currentStreak++;
                
                if (playerStats[player].currentStreak > playerStats[player].bestStreak) {
                    playerStats[player].bestStreak = playerStats[player].currentStreak;
                }
                
                emit RewardDistributed(player, REWARD_AMOUNT);
            } else if (userAnswers[questionId][player].hasAnswered) {
                // Reset streak for wrong answer
                playerStats[player].currentStreak = 0;
            }
        }
        
        // Update leaderboard sorting
        _updateLeaderboard();
    }
    
    function _updateLeaderboard() internal {
        // Simple bubble sort for leaderboard (can be optimized for production)
        for (uint256 i = 0; i < leaderboard.length; i++) {
            for (uint256 j = 0; j < leaderboard.length - 1 - i; j++) {
                if (_getPlayerScore(leaderboard[j]) < _getPlayerScore(leaderboard[j + 1])) {
                    address temp = leaderboard[j];
                    leaderboard[j] = leaderboard[j + 1];
                    leaderboard[j + 1] = temp;
                    
                    // Update indices
                    leaderboardIndex[leaderboard[j]] = j + 1;
                    leaderboardIndex[leaderboard[j + 1]] = j + 2;
                }
            }
        }
    }
    
    function _getPlayerScore(address player) internal view returns (uint256) {
        return playerStats[player].correctAnswers * 100 + playerStats[player].currentStreak * 10;
    }
    
    function getCurrentQuestion() external view returns (
        uint256 questionId,
        string memory question,
        string[] memory options,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 timeLeft
    ) {
        questionId = currentQuestionId;
        if (questions[questionId].isActive) {
            question = questions[questionId].question;
            options = questions[questionId].options;
            startTime = questions[questionId].startTime;
            endTime = questions[questionId].endTime;
            isActive = questions[questionId].isActive;
            timeLeft = endTime > block.timestamp ? endTime - block.timestamp : 0;
        }
    }
    
    function getQuestionDetails(uint256 questionId) external view returns (
        string memory question,
        string[] memory options,
        uint256 correctAnswerIndex,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        bool isRevealed,
        uint256 totalParticipants,
        uint256 correctAnswers
    ) {
        Question storage q = questions[questionId];
        return (
            q.question,
            q.options,
            q.correctAnswerIndex,
            q.startTime,
            q.endTime,
            q.isActive,
            q.isRevealed,
            q.totalParticipants,
            q.correctAnswers
        );
    }
    
    function getUserAnswer(uint256 questionId, address user) external view returns (
        uint256 answerIndex,
        bool hasAnswered,
        bool isCorrect
    ) {
        UserAnswer storage answer = userAnswers[questionId][user];
        return (answer.answerIndex, answer.hasAnswered, answer.isCorrect);
    }
    
    function getPlayerStats(address player) external view returns (
        uint256 totalQuestions,
        uint256 correctAnswers,
        uint256 totalRewards,
        uint256 currentStreak,
        uint256 bestStreak,
        uint256 accuracy
    ) {
        PlayerStats storage stats = playerStats[player];
        accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers * 100) / stats.totalQuestions : 0;
        return (
            stats.totalQuestions,
            stats.correctAnswers,
            stats.totalRewards,
            stats.currentStreak,
            stats.bestStreak,
            accuracy
        );
    }
    
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory players,
        uint256[] memory scores,
        uint256[] memory rewards
    ) {
        uint256 length = limit > leaderboard.length ? leaderboard.length : limit;
        players = new address[](length);
        scores = new uint256[](length);
        rewards = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            players[i] = leaderboard[i];
            scores[i] = _getPlayerScore(leaderboard[i]);
            rewards[i] = playerStats[leaderboard[i]].totalRewards;
        }
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(quizToken.transfer(owner(), amount), "Transfer failed");
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = quizToken.balanceOf(address(this));
        require(quizToken.transfer(owner(), balance), "Transfer failed");
    }
}
