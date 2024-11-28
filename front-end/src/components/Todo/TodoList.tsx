import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Todo {
  id: number
  text: string
  completed: boolean
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    setTodos([
      { id: 1, text: "Pay credit card bill on time", completed: false },
      { id: 2, text: "Reduce credit utilization to below 30%", completed: false },
      { id: 3, text: "Dispute any inaccuracies in credit report", completed: false },
      { id: 4, text: "Set up automatic payments for recurring bills", completed: false },
      { id: 5, text: "Apply for a credit limit increase", completed: false },
    ])
  }, [])

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">CTOS Score Improvement Todo List</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tasks to Improve Your Credit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Add a new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="mr-2"
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex items-center">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.text}
                  </label>
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteTodo(todo.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default TodoList
