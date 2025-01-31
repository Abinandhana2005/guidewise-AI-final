import React, { useState, useEffect, useRef} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KanbanBoard from './KanbanBoard';
import KanbanCard from './KanbanCard';
import './App.css';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import gantt from 'dhtmlx-gantt';





function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskName, setTaskName] = useState(''); 
  const [progressValue, setProgressValue] = useState(0);
  const [confidenceValue, setConfidenceValue] = useState(50);
  const [estimatedTimeValue, setEstimatedTimeValue] = useState(1);
  const [priorityValue, setPriorityValue] = useState(2); 
  const [moodValue, setMoodValue] = useState(1);
  const [energyValue, setEnergyValue] = useState(1);
  const [distractionValue, setDistractionValue] = useState(1);
  const [sleepQualityValue, setSleepQualityValue] = useState(1);
  const [taskSuggestions, setTaskSuggestions] = useState([]);
  const [learningStyle, setLearningStyle] = useState('');
  const [motivationalSuggestion, setMotivationalSuggestion] = useState('');
  const [bellSoundEnabled, setBellSoundEnabled] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); 
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false); 
  const [intrusiveThoughts, setIntrusiveThoughts] = useState('');
  const [unclearTopics, setUnclearTopics] = useState('');
  const [distractedCount, setDistractedCount] = useState(0);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showTaskModal, setShowTaskModal] = useState(false); 
  const [selectedTask, setSelectedTask] = useState(null); 
  const ganttContainer = useRef(null);
  

  const motivationalQuotes = [
    "Keep going! You're doing amazing!",
    "You're on fire today!",
    "Every step you take brings you closer to success!",
    "Great job! You're improving every day!",
    "You're unstoppable! Keep up the great work!"
  ];

  const breakIdeas = [
    "Listen to your favorite song!",
    "Take a 5-minute walk!",
    "Meditate for 2 minutes.",
    "Have a healthy snack.",
    "Take a short break and drink some water."
  ];

  useEffect(() => {
    if (isPomodoroRunning && pomodoroTime > 0) {
      const timer = setInterval(() => setPomodoroTime(pomodoroTime - 1), 1000);
      return () => clearInterval(timer);
    } else if (pomodoroTime === 0 && isPomodoroRunning) {
      setPomodoroCount(pomodoroCount + 1);
      setPomodoroTime(25 * 60); // Restart the timer for the next session
      toast.info("Pomodoro session completed! Starting the next session.");
    }
  }, [isPomodoroRunning, pomodoroTime, pomodoroCount]);

  useEffect(() => {
    // Initialize Gantt
    gantt.init(ganttContainer.current);

    // Task data structure for Gantt
    const ganttTasks = {
      data: tasks.map((task, index) => ({
        id: index + 1,
        text: task.name,
        start_date: new Date(),
        duration: task.estimatedTime || 1,
        progress: task.progress / 100
      }))
    };

    gantt.parse(ganttTasks); // Load tasks into Gantt

  }, [tasks]);

  // Function to request fullscreen mode
  const requestFullScreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  };

  const handlePomodoroToggle = () => {
    setIsPomodoroRunning(!isPomodoroRunning);
    if (!isPomodoroRunning) {
      setIsPomodoroMode(true); 
    }
  };

  const handleLeaveStudySession = () => {
    setIsPomodoroMode(false); 
    setIsPomodoroRunning(false); 
    setPomodoroTime(25 * 60); 
    exitFullScreen(); // Exit fullscreen when leaving the session
  };

  const handleTaskSelection = (task) => {
    setSelectedTask(task);
    const totalPomodoros = Math.ceil(task.estimatedTime / 0.5);
    setPomodoroTime(25 * 60); 
    setShowTaskModal(false);
    toast.info(`Selected task: ${task.name}. ${totalPomodoros} Pomodoros needed.`);
    
    // Trigger fullscreen mode when Pomodoro starts
    requestFullScreen(document.documentElement);
    setIsPomodoroMode(true);
    setIsPomodoroRunning(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      name: taskName,
      confidence: confidenceValue,
      progress: progressValue,
      estimatedTime: estimatedTimeValue,
      priority: priorityValue,
      done: false,
    };
    setTasks([...tasks, task]);
    setTaskName('');
    toast.success('Task added successfully!');
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    const completedTask = updatedTasks.splice(index, 1)[0];
    completedTask.done = true;
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, completedTask]);
    toast.success('Task marked as completed!');
  };

  // Function to handle "I'm Distracted" button click
  const handleDistractedClick = () => {
    const randomBreakIdea = breakIdeas[Math.floor(Math.random() * breakIdeas.length)];
    setDistractedCount(distractedCount + 1);
    setIsPomodoroRunning(false);
    toast.info(randomBreakIdea); // Show random break idea
  };

  // Function to analyze learning style based on various parameters
  const handleAnalyze = () => {
    const style = calculateLearningStyle(moodValue, energyValue, distractionValue, sleepQualityValue);
    setLearningStyle(style);
    const motivationalMessage = generateMotivationalSuggestion(style, moodValue);
    setMotivationalSuggestion(motivationalMessage);
    const taskSuggestions = calculateTaskSuggestions(moodValue, energyValue, distractionValue, sleepQualityValue);
    setTaskSuggestions(taskSuggestions);
    setShowTaskModal(true); 
    toast.success('Analysis complete! Your learning style and suggestions are ready.');
  };

  // Function to calculate learning style based on mood, energy, and distractions
  const calculateLearningStyle = (mood, energy, distraction, sleep) => {
    let kolbStyle = '';
    let varkStyle = '';

    if (mood >= 4 && energy >= 4 && distraction <= 2 && sleep >= 4) {
      kolbStyle = 'Accommodating';
      varkStyle = 'Kinesthetic';
    } else if (mood <= 2 && energy <= 2 && distraction >= 4 && sleep <= 2) {
      kolbStyle = 'Reflective Observation';
      varkStyle = 'Visual';
    } else if (energy >= 4 && distraction <= 2) {
      kolbStyle = 'Converging';
      varkStyle = 'Auditory';
    } else if (energy <= 2 || mood <= 2) {
      kolbStyle = 'Diverging';
      varkStyle = 'Reading/Writing';
    } else {
      kolbStyle = 'Assimilating';
      varkStyle = 'Visual';
    }

    return `Kolb Style: ${kolbStyle}, VARK Style: ${varkStyle}`;
  };

  // Function to generate motivational suggestions based on style and mood
  const generateMotivationalSuggestion = (style, mood) => {
    if (mood <= 2) {
      return `It seems like you're feeling a bit down. That's okay! Try using simple analogies, mind maps, or watching videos today.`;
    } else if (mood >= 4) {
      return `You're in a great mood! Dive into research-based learning, deep reading, and problem-solving. You're ready to take on challenges.`;
    }
    return `Keep pushing forward! You're doing amazing, and no matter what, you're learning every day!`;
  };

  // Function to calculate task suggestions based on mood, energy, and distractions
  const calculateTaskSuggestions = (mood, energy, distraction, sleep) => {
    if (tasks.length === 0) return [];

    const sortedTasks = tasks
      .sort((a, b) => a.confidence - b.confidence || b.priority - a.priority || b.estimatedTime - a.estimatedTime)
      .slice(0, 3);

    return sortedTasks;
  };
  const initialColumns = [
    {
      id: 'column-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', content: 'Task 1' },
        { id: 'card-2', content: 'Task 2' },
      ],
    },
    {
      id: 'column-2',
      title: 'In Progress',
      cards: [
        { id: 'card-3', content: 'Task 3' },
      ],
    },
    {
      id: 'column-3',
      title: 'Done',
      cards: [
        { id: 'card-4', content: 'Task 4' },
      ],
    },
  ];
  
  
    const [columns, setColumns] = useState(initialColumns);
  
    const onDragEnd = (result) => {
      const { destination, source, draggableId } = result;
  
      if (!destination) return;
  
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }
  
      const startColumn = columns.find((column) => column.id === source.droppableId);
      const finishColumn = columns.find((column) => column.id === destination.droppableId);
  
      if (startColumn === finishColumn) {
        const newCards = Array.from(startColumn.cards);
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, { id: draggableId, content: draggableId });
  
        const newColumn = {
          ...startColumn,
          cards: newCards,
        };
  
        setColumns(columns.map((column) =>
          column.id === startColumn.id ? newColumn : column
        ));
        return;
      }
  
      const startCards = Array.from(startColumn.cards);
      startCards.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        cards: startCards,
      };
  
      const finishCards = Array.from(finishColumn.cards);
      finishCards.splice(destination.index, 0, { id: draggableId, content: draggableId });
      const newFinishColumn = {
        ...finishColumn,
        cards: finishCards,
      };
  
      setColumns(columns.map((column) =>
        column.id === newStartColumn.id ? newStartColumn : column.id === newFinishColumn.id ? newFinishColumn : column
      ));
    };

   
    
    

  return (
    <div className={`App ${isPomodoroMode ? 'pomodoro-mode' : ''}`}>
      {!isPomodoroMode && (
        <>
          <h1 className="app-title">GuideWise AI</h1>
          <div className="spline-animation">
            <iframe 
              src="https://my.spline.design/draganddropbookpencilschoolcopy-f0f297d384cf744b4944a2eed7501ad9/" 
              frameBorder="0" 
              width="100%" 
              height="500px" 
              title="Spline 3D Animation"
              style={{ borderRadius: '10px', marginBottom: '20px' }}
            ></iframe>
          </div>
          <div className="container">
            <div className="left-section">
              <h2>Task Update</h2>
              <form onSubmit={handleSubmit}>
                <label>What’s your study goal for today?</label>
                <br />
                <input 
                  type="text" 
                  value={taskName} 
                  onChange={(e) => setTaskName(e.target.value)} 
                  placeholder="Enter your task..."  
                />
                <br /> <br />

                <label>Progress:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progressValue} 
                  onChange={(e) => setProgressValue(e.target.value)} 
                  className="slider" 
                />
               
                <p>{progressValue}%</p>
                <br /> <br />

                <label>Confidence:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={confidenceValue} 
                  onChange={(e) => setConfidenceValue(e.target.value)} 
                  className="slider" 
                />
                <p>{confidenceValue}%</p>
                <br /> <br />
                <label>Estimated Time:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={estimatedTimeValue} 
                  onChange={(e) => setEstimatedTimeValue(e.target.value)} 
                  className="slider" 
                />
                <p>{estimatedTimeValue} hours</p>
                <br /> <br />
                <label>Priority (1 = Low, 3 = High):</label>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  value={priorityValue} 
                  onChange={(e) => setPriorityValue(parseInt(e.target.value))}
                  className="slider" 
                />
                <p>{priorityValue === 3 ? 'High' : priorityValue === 2 ? 'Medium' : 'Low'}</p>
                
                <button className="submit-btn" type="submit">Add Task</button>
              </form>
              <br /> <br /> 
              <h3>Task List</h3>
              <table className="task-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Progress</th>
                    <th>Confidence</th>
                    <th>Estimated Time</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{task.name}</td>
                        <td>{task.progress}%</td>
                        <td>{task.confidence}%</td>
                        <td>{task.estimatedTime} hours</td>
                        <td>{task.priority === 3 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}</td>
                        <td>
                          <button onClick={() => handleTaskCompletion(index)}>Complete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No tasks available. Please add a task!</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <br /> <br />
              <h3>Completed Tasks</h3>
              {completedTasks.length > 0 ? (
                <ul className="completed-tasks-list">
                  {completedTasks.map((task, index) => (
                    <li key={index}>{task.name} - Completed</li>
                  ))}
                </ul>
              ) : (
                <p>No tasks completed yet.</p>
              )}
            </div>

            <div className="right-section">
              <h2>AI Learning Style Analysis</h2>

              <label>Mood (1 = Sad, 5 = Happy)</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={moodValue} 
                onChange={(e) => setMoodValue(e.target.value)} 
                className="slider" 
              />
              <p>Mood: {moodValue}</p>
              <br /> <br />
              <label>Energy Level (1 = Low, 5 = High)</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={energyValue} 
                onChange={(e) => setEnergyValue(e.target.value)} 
                className="slider" 
              />
              <p>Energy: {energyValue}</p>
              <br /> <br />
              <label>Distraction Level (1 = Focused, 5 = Distracted)</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={distractionValue} 
                onChange={(e) => setDistractionValue(e.target.value)} 
                className="slider" 
              />
              <p>Distraction: {distractionValue}</p>
              <br /> <br />
              <label>Sleep Quality (1 = Poor, 5 = Well-Rested)</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={sleepQualityValue} 
                onChange={(e) => setSleepQualityValue(e.target.value)} 
                className="slider" 
              />
              <p>Sleep Quality: {sleepQualityValue}</p>
              <br /><hr /><br />
              <button className="analyze-btn" onClick={handleAnalyze}>Analyze Learning Style</button>
              <br /> <br /> 
              {learningStyle && (
                <div className="learning-suggestion">
                  <h3>Your Learning Style</h3>
                  <p>{learningStyle}</p>
                  
                  <h4>Motivational Suggestion</h4>
                  <p>{motivationalSuggestion}</p>
                </div>
              )}
              
              {taskSuggestions.length > 0 && (
                <div className="task-suggestions">
                  <h3>Suggested Tasks</h3>
                  <ul>
                    {taskSuggestions.map((task, index) => (
                      <li key={index}>{task.name} - Confidence: {task.confidence}% - Estimated Time: {task.estimatedTime} hours</li>
                    ))}
                  </ul>
                  
                  <button className="kickstart-btn">Kickstart for Today!</button>
                </div>
              )}
              
              <div className="pomodoro-section">
                <h2>Pomodoro Timer</h2>
                <p className="pomodoro-timer">
                  {Math.floor(pomodoroTime / 60)}:{pomodoroTime % 60 < 10 ? '0' : ''}{pomodoroTime % 60}
                </p>
                <br /><br /><br /> 
                
              
              <div className="bell-toggle-section">
                <h3>Focus Bell</h3>
                <label>
                  <input 
                    type="checkbox" 
                    checked={bellSoundEnabled} 
                    onChange={() => setBellSoundEnabled(!bellSoundEnabled)} 
                  />
                  Enable Focus Bell
                </label>
              </div>
              <hr />
              <br />
              <div className="distracted-section">
                <h3>Feeling Distracted?</h3>
                <button onClick={handleDistractedClick}>I'm Distracted</button>
              </div>
                <p>Distraction Count: {distractedCount}</p>
              </div>
              
             
               
            </div>
          </div>
          
        </>
      )}

      {showTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Choose a Task</h3>
            <ul>
              {taskSuggestions.map((task, index) => (
                <li key={index} onClick={() => handleTaskSelection(task)}>
                  {task.name} - {task.estimatedTime} hours - {Math.ceil(task.estimatedTime / 0.5)} Pomodoros
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isPomodoroMode && (
        <div className="pomodoro-fullscreen">
          <div className="fullscreen-timer">
            <h1>Pomodoro Session</h1>
            <p className="pomodoro-timer-large">
              {Math.floor(pomodoroTime / 60)}:{pomodoroTime % 60 < 10 ? '0' : ''}{pomodoroTime % 60}
            </p>
          </div>
      

          <div className="pomodoro-thoughts-section">
            <h3>Intrusive Thoughts</h3>
            <textarea 
              placeholder="Log your intrusive thoughts here..." 
              value={intrusiveThoughts}
              onChange={(e) => setIntrusiveThoughts(e.target.value)} 
            />
          </div>

          <div className="pomodoro-unclear-section">
            <h3>Unclear Topics</h3>
            <textarea 
              placeholder="Log unclear topics or questions here..." 
              value={unclearTopics}
              onChange={(e) => setUnclearTopics(e.target.value)} 
              
            />
            <br /> <br /> <br />
          </div>
        <br /> <br /> <br />
          <button className="leave-session-btn" onClick={handleLeaveStudySession}>
            Leave Study Session (I Quit)
          </button>
        </div>
        
        
      )}
      <br /> <br /> <br />
      <div className="App">
      <br /> <br /> <br /> <br /> <br /> 
                <h1>Kanban Board</h1>
                  <KanbanBoard columns={columns} onDragEnd={onDragEnd} />
                  
      </div>



        
      <h1>GuideWise AI with Gantt Chart</h1>

          <form onSubmit={handleSubmit}>
            <label>What’s your study goal for today?</label>
            <br />
            <input 
                type="text" 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                placeholder="Enter your task..." 
              />
              <button type="submit">Add Task</button>
            </form>

            <div 
              ref={ganttContainer} 
              className="gantt-container"
            
              ></div>
               



        

       
      <ToastContainer />
    </div>
  );
}

export default App;