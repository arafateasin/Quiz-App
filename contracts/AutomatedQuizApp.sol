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

contract AutomatedQuizApp is ReentrancyGuard, Pausable, Ownable {
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
    
    struct QuestionTemplate {
        string question;
        string[] options;
        uint256 correctAnswerIndex;
        bool isActive;
    }
    
    mapping(uint256 => Question) public questions;
    mapping(uint256 => mapping(address => UserAnswer)) public userAnswers;
    mapping(address => PlayerStats) public playerStats;
    mapping(uint256 => QuestionTemplate) public questionPool;
    mapping(uint256 => address[]) public questionParticipants; // Track participants per question
    
    uint256 public currentQuestionId;
    uint256 public constant QUESTION_DURATION = 30 seconds;
    uint256 public constant REWARD_AMOUNT = 10 * 10**18; // 10 tokens
    uint256 public totalQuestionsCount;
    uint256 public poolSize;
    uint256 public lastQuestionTime;
    uint256 public currentPoolIndex;
    bool public autoMode;
    
    address[] public leaderboard;
    mapping(address => uint256) public leaderboardIndex;
    
    event QuestionCreated(uint256 indexed questionId, string question, uint256 startTime, uint256 endTime);
    event AnswerSubmitted(uint256 indexed questionId, address indexed player, uint256 answerIndex);
    event QuestionRevealed(uint256 indexed questionId, uint256 correctAnswer, uint256 totalParticipants, uint256 correctAnswers);
    event RewardDistributed(address indexed player, uint256 amount);
    event LeaderboardUpdated(address indexed player, uint256 newScore);
    event AutoModeToggled(bool enabled);
    event QuestionPoolUpdated(uint256 newSize);
    
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
        poolSize = 0;
        currentPoolIndex = 0;
        autoMode = false;
        lastQuestionTime = 0;
        
        // Initialize with some default questions
        _initializeQuestionPool();
    }
    
    function _initializeQuestionPool() internal {
        // Blockchain/Crypto Questions
        string[] memory options1 = new string[](4);
        options1[0] = "Bitcoin";
        options1[1] = "Ether";
        options1[2] = "Litecoin";
        options1[3] = "Dogecoin";
        addQuestionToPool("What is the native cryptocurrency of Ethereum?", options1, 1);
        
        string[] memory options2 = new string[](4);
        options2[0] = "Decentralized Finance";
        options2[1] = "Digital Finance";
        options2[2] = "Distributed Finance";
        options2[3] = "Defiant Finance";
        addQuestionToPool("What does 'DeFi' stand for?", options2, 0);
        
        string[] memory options3 = new string[](4);
        options3[0] = "A legal document";
        options3[1] = "Self-executing code on blockchain";
        options3[2] = "A trading bot";
        options3[3] = "A wallet type";
        addQuestionToPool("What is a smart contract?", options3, 1);
        
        string[] memory options4 = new string[](4);
        options4[0] = "Proof of Work";
        options4[1] = "Proof of Stake";
        options4[2] = "Proof of Authority";
        options4[3] = "Proof of Space";
        addQuestionToPool("What consensus mechanism does Ethereum 2.0 use?", options4, 1);
        
        // General Knowledge Questions
        string[] memory options5 = new string[](4);
        options5[0] = "London";
        options5[1] = "Berlin";
        options5[2] = "Paris";
        options5[3] = "Madrid";
        addQuestionToPool("What is the capital of France?", options5, 2);
        
        string[] memory options6 = new string[](4);
        options6[0] = "3";
        options6[1] = "4";
        options6[2] = "5";
        options6[3] = "6";
        addQuestionToPool("What is 2 + 2?", options6, 1);
        
        string[] memory options7 = new string[](4);
        options7[0] = "Venus";
        options7[1] = "Mars";
        options7[2] = "Jupiter";
        options7[3] = "Saturn";
        addQuestionToPool("Which planet is known as the Red Planet?", options7, 1);
        
        string[] memory options8 = new string[](4);
        options8[0] = "Atlantic";
        options8[1] = "Pacific";
        options8[2] = "Indian";
        options8[3] = "Arctic";
        addQuestionToPool("What is the largest ocean on Earth?", options8, 1);
        
        // Technology Questions
        string[] memory options9 = new string[](4);
        options9[0] = "Artificial Intelligence";
        options9[1] = "Automated Intelligence";
        options9[2] = "Advanced Intelligence";
        options9[3] = "Augmented Intelligence";
        addQuestionToPool("What does 'AI' stand for?", options9, 0);
        
        string[] memory options10 = new string[](4);
        options10[0] = "Python";
        options10[1] = "JavaScript";
        options10[2] = "Solidity";
        options10[3] = "Java";
        addQuestionToPool("Which programming language is known for blockchain development?", options10, 2);
    }
    
    function addQuestionToPool(
        string memory _question,
        string[] memory _options,
        uint256 _correctAnswerIndex
    ) public onlyOwner {
        require(_options.length >= 2 && _options.length <= 6, "Invalid number of options");
        require(_correctAnswerIndex < _options.length, "Invalid correct answer index");
        
        questionPool[poolSize] = QuestionTemplate({
            question: _question,
            options: _options,
            correctAnswerIndex: _correctAnswerIndex,
            isActive: true
        });
        
        poolSize++;
        emit QuestionPoolUpdated(poolSize);
    }
    
    function toggleAutoMode() external onlyOwner {
        autoMode = !autoMode;
        if (autoMode) {
            lastQuestionTime = block.timestamp;
        }
        emit AutoModeToggled(autoMode);
    }
    
    function checkAndCreateNextQuestion() external {
        require(autoMode, "Auto mode is not enabled");
        require(poolSize > 0, "No questions in pool");
        
        // Check if enough time has passed since last question
        if (block.timestamp >= lastQuestionTime + QUESTION_DURATION) {
            // Reveal current question if it exists and hasn't been revealed
            if (currentQuestionId < totalQuestionsCount && 
                questions[currentQuestionId].isActive && 
                !questions[currentQuestionId].isRevealed &&
                block.timestamp > questions[currentQuestionId].endTime) {
                _revealAnswerAndDistributeRewards(currentQuestionId);
            }
            
            // Create next question
            _createNextQuestion();
        }
    }
    
    // Auto-trigger function that can be called by anyone to keep the quiz running
    function autoTrigger() external {
        if (autoMode && poolSize > 0) {
            // Auto-reveal current question if time is up
            if (currentQuestionId < totalQuestionsCount && 
                questions[currentQuestionId].isActive && 
                !questions[currentQuestionId].isRevealed &&
                block.timestamp > questions[currentQuestionId].endTime) {
                _revealAnswerAndDistributeRewards(currentQuestionId);
            }
            
            // Auto-create next question if enough time has passed
            if (block.timestamp >= lastQuestionTime + QUESTION_DURATION) {
                _createNextQuestion();
            }
        }
    }
    
    function _createNextQuestion() internal {
        require(poolSize > 0, "No questions in pool");
        
        // Get next question from pool (cycle through)
        QuestionTemplate memory template = questionPool[currentPoolIndex];
        currentPoolIndex = (currentPoolIndex + 1) % poolSize;
        
        uint256 questionId = totalQuestionsCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + QUESTION_DURATION;
        
        questions[questionId] = Question({
            question: template.question,
            options: template.options,
            correctAnswerIndex: template.correctAnswerIndex,
            startTime: startTime,
            endTime: endTime,
            isActive: true,
            isRevealed: false,
            totalParticipants: 0,
            correctAnswers: 0
        });
        
        currentQuestionId = questionId;
        lastQuestionTime = startTime;
        
        emit QuestionCreated(questionId, template.question, startTime, endTime);
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
        
        // Track participant for automatic reward distribution
        questionParticipants[questionId].push(msg.sender);
        
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
    
    function _revealAnswerAndDistributeRewards(uint256 questionId) internal {
        require(questions[questionId].isActive, "Question is not active");
        require(!questions[questionId].isRevealed, "Answer already revealed");
        
        questions[questionId].isActive = false;
        questions[questionId].isRevealed = true;
        
        // Process all answers and automatically distribute rewards
        _processAnswersAndAutoDistributeRewards(questionId);
        
        emit QuestionRevealed(
            questionId,
            questions[questionId].correctAnswerIndex,
            questions[questionId].totalParticipants,
            questions[questionId].correctAnswers
        );
    }
    
    function _processAnswersAndAutoDistributeRewards(uint256 questionId) internal {
        Question storage question = questions[questionId];
        uint256 correctAnswerIndex = question.correctAnswerIndex;
        
        // Get all participants for this question
        address[] memory participants = questionParticipants[questionId];
        uint256 correctCount = 0;
        
        // Process each participant and distribute rewards automatically
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            
            if (userAnswers[questionId][participant].hasAnswered &&
                userAnswers[questionId][participant].answerIndex == correctAnswerIndex) {
                
                correctCount++;
                
                // Mark as correct
                userAnswers[questionId][participant].isCorrect = true;
                
                // Update player stats
                playerStats[participant].correctAnswers++;
                playerStats[participant].totalRewards += REWARD_AMOUNT;
                playerStats[participant].currentStreak++;
                
                if (playerStats[participant].currentStreak > playerStats[participant].bestStreak) {
                    playerStats[participant].bestStreak = playerStats[participant].currentStreak;
                }
                
                // Automatic token transfer
                quizToken.transfer(participant, REWARD_AMOUNT);
                
                emit RewardDistributed(participant, REWARD_AMOUNT);
                emit LeaderboardUpdated(participant, playerStats[participant].correctAnswers);
            } else {
                // Reset streak for wrong answer
                playerStats[participant].currentStreak = 0;
            }
        }
        
        question.correctAnswers = correctCount;
    }
    
    // Enhanced reward claiming with automatic distribution
    function claimReward(uint256 questionId) external nonReentrant {
        require(questions[questionId].isRevealed, "Question not revealed yet");
        require(userAnswers[questionId][msg.sender].hasAnswered, "Did not participate");
        require(!userAnswers[questionId][msg.sender].isCorrect, "Reward already claimed");
        
        if (userAnswers[questionId][msg.sender].answerIndex == questions[questionId].correctAnswerIndex) {
            userAnswers[questionId][msg.sender].isCorrect = true;
            
            // Update player stats
            playerStats[msg.sender].correctAnswers++;
            playerStats[msg.sender].totalRewards += REWARD_AMOUNT;
            playerStats[msg.sender].currentStreak++;
            
            if (playerStats[msg.sender].currentStreak > playerStats[msg.sender].bestStreak) {
                playerStats[msg.sender].bestStreak = playerStats[msg.sender].currentStreak;
            }
            
            // Automatic token transfer - no manual claiming needed
            quizToken.transfer(msg.sender, REWARD_AMOUNT);
            
            emit RewardDistributed(msg.sender, REWARD_AMOUNT);
            emit LeaderboardUpdated(msg.sender, playerStats[msg.sender].correctAnswers);
        } else {
            // Reset streak for wrong answer
            playerStats[msg.sender].currentStreak = 0;
            // Mark as processed even if wrong to prevent re-processing
            userAnswers[questionId][msg.sender].isCorrect = false;
        }
    }
    
    // Batch reward distribution for automatic processing
    function distributeRewards(uint256 questionId, address[] calldata participants) external {
        require(questions[questionId].isRevealed, "Question not revealed yet");
        require(msg.sender == owner() || autoMode, "Not authorized");
        
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            
            if (userAnswers[questionId][participant].hasAnswered && 
                !userAnswers[questionId][participant].isCorrect &&
                userAnswers[questionId][participant].answerIndex == questions[questionId].correctAnswerIndex) {
                
                userAnswers[questionId][participant].isCorrect = true;
                
                // Update player stats
                playerStats[participant].correctAnswers++;
                playerStats[participant].totalRewards += REWARD_AMOUNT;
                playerStats[participant].currentStreak++;
                
                if (playerStats[participant].currentStreak > playerStats[participant].bestStreak) {
                    playerStats[participant].bestStreak = playerStats[participant].currentStreak;
                }
                
                // Transfer reward
                quizToken.transfer(participant, REWARD_AMOUNT);
                
                emit RewardDistributed(participant, REWARD_AMOUNT);
                emit LeaderboardUpdated(participant, playerStats[participant].correctAnswers);
            }
        }
    }
    
    function getCurrentQuestion() external view returns (
        uint256 questionId,
        string memory question,
        string[] memory options,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        bool isRevealed,
        uint256 totalParticipants
    ) {
        if (currentQuestionId >= totalQuestionsCount) {
            return (0, "", new string[](0), 0, 0, false, false, 0);
        }
        
        Question storage q = questions[currentQuestionId];
        return (
            currentQuestionId,
            q.question,
            q.options,
            q.startTime,
            q.endTime,
            q.isActive,
            q.isRevealed,
            q.totalParticipants
        );
    }
    
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }
    
    function getLeaderboard() external view returns (address[] memory) {
        return leaderboard;
    }
    
    function getQuestionPool() external view returns (uint256) {
        return poolSize;
    }
    
    function isAutoModeEnabled() external view returns (bool) {
        return autoMode;
    }
    
    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = quizToken.balanceOf(address(this));
        quizToken.transfer(owner(), balance);
    }
}
