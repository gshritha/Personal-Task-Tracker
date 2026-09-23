import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function TaskList() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const token = localStorage.getItem('token')

  // Keeps track of tasks that already showed a notification
  const notifiedIds = useRef(new Set())

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [category, setCategory] = useState('PERSONAL')
  const [dueDate, setDueDate] = useState('')

  // =========================
  // LOAD TASKS + NOTIFICATIONS
  // =========================
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const setupNotifications = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission()
        }
      }

      fetchTasks()
    }

    setupNotifications()

    // Check for due tasks every minute
    const reminderInterval = setInterval(() => {
      fetchTasks()
    }, 60 * 1000)

    // Stop checking when leaving the page
    return () => clearInterval(reminderInterval)
  }, [])

  // =========================
  // CHECK FOR DUE TASKS
  // =========================
  const checkReminders = (taskList) => {
    if (
      !('Notification' in window) ||
      Notification.permission !== 'granted'
    ) {
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    taskList.forEach((task) => {
      // Ignore completed tasks and tasks without due dates
      if (task.status === 'COMPLETED' || !task.dueDate) {
        return
      }

      // Don't notify the same task repeatedly
      if (notifiedIds.current.has(task.id)) {
        return
      }

      const due = new Date(task.dueDate)
      due.setHours(0, 0, 0, 0)

      // Task is due today or overdue
      if (due <= today) {
        const overdue = due < today

        new Notification('Task Reminder', {
          body: `"${task.title}" is ${
            overdue ? 'overdue' : 'due today'
          }`
        })

        // Remember that notification was already shown
        notifiedIds.current.add(task.id)
      }
    })
  }

  // =========================
  // FETCH TASKS
  // =========================
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/tasks',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTasks(response.data)

      // Check reminders whenever tasks are fetched
      checkReminders(response.data)

    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  // =========================
  // CREATE TASK
  // =========================
  const createTask = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        'http://localhost:8080/api/v1/tasks',
        {
          title: title,
          description: description,
          priority: priority,
          category: category,
          dueDate: dueDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Clear form
      setTitle('')
      setDescription('')
      setPriority('MEDIUM')
      setCategory('PERSONAL')
      setDueDate('')

      // Refresh tasks
      fetchTasks()

    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task.')
    }
  }

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchTasks()

    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  // =========================
  // TOGGLE TASK STATUS
  // =========================
  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === 'COMPLETED'
        ? 'PENDING'
        : 'COMPLETED'

    try {
      await axios.patch(
        `http://localhost:8080/api/v1/tasks/${id}/status`,
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      fetchTasks()

    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  // =========================
  // PROGRESS
  // =========================
  const completedCount = tasks.filter(
    (t) => t.status === 'COMPLETED'
  ).length

  const progressPercent =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0

  // =========================
  // CHECK DUE / OVERDUE
  // =========================
  const isDueOrOverdue = (task) => {
    if (task.status === 'COMPLETED' || !task.dueDate) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const due = new Date(task.dueDate)
    due.setHours(0, 0, 0, 0)

    return due <= today
  }

  // =========================
  // SELECT STYLE
  // =========================
  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#14161f',
    border: '1px solid #2a2d3a',
    borderRadius: '8px',
    color: '#e8e8ea',
    fontSize: '14px'
  }

  return (
    <div>

      {/* PAGE TITLE */}
      <h2 className="page-title">My Tasks</h2>

      {/* PROGRESS BAR */}
      {tasks.length > 0 && (
        <div style={{ marginBottom: '24px' }}>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: '#a8acbd'
              }}
            >
              {completedCount} of {tasks.length} tasks completed
            </span>

            <span
              style={{
                fontSize: '13px',
                color: '#a8acbd'
              }}
            >
              {progressPercent}%
            </span>
          </div>

          <div
            style={{
              background: '#2a2d3a',
              borderRadius: '999px',
              height: '8px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                background: '#5b7fff',
                height: '100%',
                borderRadius: '999px',
                width: `${progressPercent}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>

        </div>
      )}

      <div className="tasks-layout">

        {/* =========================
            ADD TASK FORM
        ========================= */}
        <div className="tasks-form-panel">

          <div className="auth-card">

            <h2
              style={{
                fontSize: '16px',
                marginBottom: '16px'
              }}
            >
              Add a new task
            </h2>

            <form onSubmit={createTask}>

              {/* TITLE */}
              <div className="form-group">
                <label>Title</label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              {/* CATEGORY */}
              <div className="form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  style={selectStyle}
                >
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="HEALTH">Health</option>
                  <option value="FINANCE">Finance</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div className="form-group">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  style={selectStyle}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              {/* DUE DATE */}
              <div className="form-group">
                <label>Due date</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
              >
                Add task
              </button>

            </form>
          </div>
        </div>

        {/* =========================
            TASK LIST
        ========================= */}
        <div className="tasks-list-panel">

          {tasks.length === 0 ? (

            <div className="empty-state">
              No tasks yet.
            </div>

          ) : (

            tasks.map((task) => (

              <div
                className="task-card"
                key={task.id}
                style={
                  isDueOrOverdue(task)
                    ? { borderColor: '#f87171' }
                    : undefined
                }
              >

                <div className="task-info">

                  <h3>{task.title}</h3>

                  <p>{task.description}</p>

                  <div className="task-meta">

                    {/* STATUS */}
                    <span
                      className={`badge badge-${task.status
                        .toLowerCase()
                        .replace('_', '-')}`}
                    >
                      {task.status}
                    </span>

                    {/* PRIORITY */}
                    <span
                      className={`priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority} priority
                    </span>

                    {/* CATEGORY */}
                    {task.category && (
                      <span className="category-tag">
                        {task.category}
                      </span>
                    )}

                    {/* DUE */}
                    {isDueOrOverdue(task) && (
                      <span
                        className="category-tag"
                        style={{
                          background: '#4a2424',
                          color: '#f87171'
                        }}
                      >
                        Due
                      </span>
                    )}

                  </div>
                </div>

                {/* ACTIONS */}
                <div className="task-actions">

                  <button
                    className="btn-small"
                    onClick={() =>
                      toggleStatus(
                        task.id,
                        task.status
                      )
                    }
                  >
                    {task.status === 'COMPLETED'
                      ? 'Mark Pending'
                      : 'Mark Complete'}
                  </button>

                  <button
                    className="btn-small btn-delete"
                    onClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          )}

        </div>
      </div>
    </div>
  )
}

export default TaskList