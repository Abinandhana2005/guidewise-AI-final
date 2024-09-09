import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [confidenceValue, setConfidenceValue] = useState(50);
  const [estimatedTimeValue, setEstimatedTimeValue] = useState(1);
  const [moodValue, setMoodValue] = useState(1);
  const [energyValue, setEnergyValue] = useState(1);
  const [distractionValue, setDistractionValue] = useState(1);
  const [sleepQualityValue, setSleepQualityValue] = useState(1);
  const [taskSuggestions, setTaskSuggestions] = useState([]);

  const handleAnalyze = () => {
    const taskSuggestions = calculateTaskSuggestions(moodValue, energyValue, distractionValue, sleepQualityValue);
    setTaskSuggestions(taskSuggestions);

    toast.success('Analysis complete! Your suggestions have been updated.');
  };

  const calculateTaskSuggestions = (mood, energy, distraction, sleep) => {
    return processTasks(tasks, mood, energy, distraction, sleep);
  };

  const processTasks = (tasks, mood, energy, distraction, sleep) => {
    if (tasks.length === 0) return [];

    const sortedTasks = tasks
      .sort((a, b) => a.confidence - b.confidence || b.estimatedTime - a.estimatedTime)
      .slice(0, 3); // Get top 3 tasks based on criteria
    return sortedTasks;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      name: 'Task ' + (tasks.length + 1),
      confidence: confidenceValue,
      progress: progressValue,
      estimatedTime: estimatedTimeValue,
      done: false,
    };

    setTasks([...tasks, task]);
    toast.success('Task added successfully!');
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    toast.info('Task deleted successfully!');
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    const completedTask = updatedTasks.splice(index, 1)[0];
    completedTask.done = true;

    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, completedTask]);
    toast.success('Task marked as completed!');
  };

  return (
    <div className="App">
      <h1 className="app-title">GUIDEWISE AI</h1>

      <div className="container">
        {/* Task Update Form */}
        <div className="left-section">
          <h2>Task Update</h2>
          <label>What’s your study goal for today?</label>
          <input type="text" placeholder="Enter your task..." />

          <label>Progress:</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progressValue} 
            onChange={(e) => setProgressValue(e.target.value)} 
          />
          <p>{progressValue}%</p>

          <label>Confidence:</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={confidenceValue} 
            onChange={(e) => setConfidenceValue(e.target.value)} 
          />
          <p>{confidenceValue}%</p>

          <label>Estimated Time:</label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={estimatedTimeValue} 
            onChange={(e) => setEstimatedTimeValue(e.target.value)} 
          />
          <p>{estimatedTimeValue} hours</p>

          <button className="submit-btn" onClick={handleSubmit}>Submit</button>

          {/* Task List */}
          <h3>Task List</h3>
          <table className="task-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Task</th>
                <th>Progress</th>
                <th>Confidence</th>
                <th>Estimated Time (hours)</th>
                <th>Done</th>
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
                    <td>{task.estimatedTime}</td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleTaskCompletion(index)}
                        checked={task.done}
                      />
                    </td>
                    <td><button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No tasks available. Please add a task!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AI Learning Style Analysis */}
        <div className="right-section">
          <h2>AI Learning Style Analysis</h2>

          <label>Mood (1 = Sad, 5 = Happy)</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={moodValue} 
            onChange={(e) => setMoodValue(e.target.value)} 
          />
          <p>{moodValue}</p>

          <label>Energy Level (1 = Low, 5 = High)</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={energyValue} 
            onChange={(e) => setEnergyValue(e.target.value)} 
          />
          <p>{energyValue}</p>

          <label>Distraction Level (1 = Focused, 5 = Distracted)</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={distractionValue} 
            onChange={(e) => setDistractionValue(e.target.value)} 
          />
          <p>{distractionValue}</p>

          <label>Sleep Quality (1 = Poor, 5 = Well-Rested)</label>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={sleepQualityValue} 
            onChange={(e) => setSleepQualityValue(e.target.value)} 
          />
          <p>{sleepQualityValue}</p>

          <button className="analyze-btn" onClick={handleAnalyze}>Analyze Learning Style</button>

          {/* Task Suggestions */}
          <div className="learning-suggestion">
            <h3>Suggested Tasks:</h3>
            {taskSuggestions.length > 0 ? (
              <ul>
                {taskSuggestions.map((task, index) => (
                  <li key={index}>{task.name} - Confidence: {task.confidence}% - Estimated Time: {task.estimatedTime} hours</li>
                ))}
              </ul>
            ) : (
              <p>Take up the learning style analysis to kickstart on the task!</p>
            )}
          </div>

          {/* Completed Tasks Section */}
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
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
