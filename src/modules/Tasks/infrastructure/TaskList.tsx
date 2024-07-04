import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useFetch, useToken } from "../../Shared/application/hooks";
import { Button, message, Spin } from "antd";
import { Task, TaskSchema } from "../domain";
import { Service } from "../../Shared/domain";
import { z } from "zod";
import { appFetch } from "../../Shared/application/utils";
import { TaskItem } from "./Task";

import cs from "./TaskList.module.css";

export function Tasks() {
  const token = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const { loading, result, refresh } = useFetch<Task[]>({
    service: Service.Tasks,
    path: "/tasks",
    schema: z.array(TaskSchema),
  });

  function onNewTask() {
    appFetch<void>({
      service: Service.Tasks,
      path: "/task",
      method: "POST",
    })
      .then(() => refresh())
      .catch((e) => {
        console.error(e);
        message.error("Failed to create task");
      });
  }

  if (loading || !result) {
    return <Spin />;
  }

  let list = result.isOk() ? [...result.unwrap()] : [];
  list.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
  list.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0));

  return (
    <div>
      <div className={cs.header}>
        <h1>Tasks</h1>
        <Button type="primary" onClick={onNewTask} size="small">
          Create
        </Button>
      </div>
      <ul className={!list.length ? cs.empty : undefined}>
        {list.length === 0 && <p>No tasks created yet</p>}
        {list.map((task) => (
          <li key={task.id}>
            <TaskItem task={task} onUpdateFinished={refresh} />
          </li>
        ))}
      </ul>
    </div>
  );
}
