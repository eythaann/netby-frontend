import { Button, Input, message, Switch } from "antd";
import { Task } from "../domain";
import { useState } from "react";
import moment from "moment";

import cs from "./Task.module.css";
import { appFetch } from "../../Shared/application/utils";
import { Service } from "../../Shared/domain";

interface Props {
  task: Task;
  onUpdateFinished: () => void;
}

const format = "MMMM Do YYYY";

export function TaskItem(props: Props) {
  const [task, setTask] = useState({ ...props.task });
  const [editing, setEditing] = useState(false);

  function onDelete() {
    appFetch<void>({
      service: Service.Tasks,
      path: `/task/${task.id}`,
      method: "DELETE",
    })
      .then(() => {
        message.success("Task deleted");
        setEditing(false);
        props.onUpdateFinished();
      })
      .catch((e) => {
        console.error(e);
        message.error("Failed to delete task");
      });
  }

  function onSave() {
    appFetch<void>({
      service: Service.Tasks,
      path: `/task/${task.id}`,
      method: "PUT",
      body: task,
    })
      .then(() => {
        message.success("Task updated");
        setEditing(false);
        props.onUpdateFinished();
      })
      .catch((e) => {
        console.error(e);
        message.error("Failed to update task");
      });
  }

  return (
    <div className={cs.box}>
      <div className={cs.content + (task.isCompleted ? " " + cs.completed : "")}>
        <div className={cs.title}>
          {editing ? (
            <Input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Title"
            />
          ) : (
            <b>{task.title}</b>
          )}
          <Switch
            checked={task.isCompleted}
            size="small"
            onChange={() => setTask({ ...task, isCompleted: !task.isCompleted })}
            disabled={!editing}
          />
        </div>
        {editing ? (
          <Input.TextArea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            style={{ height: 120, resize: "none" }}
            showCount
            maxLength={3000}
            placeholder="Description"
          />
        ) : (
          <p>{task.description}</p>
        )}
        <p className={cs.date}>
          Created at: <b>{moment(task.creationDate).format(format)}</b> - Expire:{" "}
          <b>{moment(task.expirationDate).format(format)}</b>
        </p>
      </div>
      <div className={cs.actions}>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            if (editing) {
              onSave();
            } else {
              setEditing(true);
            }
          }}
        >
          {editing ? "Save" : "Edit"}
        </Button>
        <Button type="primary" danger size="small" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
