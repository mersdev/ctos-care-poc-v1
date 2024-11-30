import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IconChecklist, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { initialTodos } from "./TodoListDash";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   setTodos([
  //     { id: 1, text: "Pay credit card bill on time", completed: false },
  //     {
  //       id: 2,
  //       text: "Reduce credit utilization to below 30%",
  //       completed: false,
  //     },
  //     {
  //       id: 3,
  //       text: "Dispute any inaccuracies in credit report",
  //       completed: false,
  //     },
  //     {
  //       id: 4,
  //       text: "Set up automatic payments for recurring bills",
  //       completed: false,
  //     },
  //     { id: 5, text: "Apply for a credit limit increase", completed: false },
  //   ]);
  // }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold ">
          Tasks to Improve Your Credit Score
        </h1>{" "}
        {location.pathname !== "/dashboard" && (
          <button
            onClick={() => navigate("/todo-list")}
            className="flex items-center text-sm hover-focus-effect"
          >
            VIEW ALL RECORD
          </button>
        )}
      </div>
      {/* <h1 className="text-3xl font-bold mb-6">
        CTOS Score Improvement Todo List
      </h1> */}
      <Card>
        <CardContent>
          <div className="flex mb-4 mt-8 items-center pr-2">
            <Input
              type="text"
              placeholder="Add a new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="mr-2"
            />
            <Button onClick={addTodo} className="min-w-[50px]">
              <IconChecklist size={20} />
            </Button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 bg-secondary rounded-lg"
              >
                <div className="flex items-center">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`${
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {todo.text}
                  </label>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="min-w-[50px]"
                >
                  <IconTrash size={20} />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
