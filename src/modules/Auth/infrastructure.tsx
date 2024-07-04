import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";

import cs from "./index.module.css";
import { useState } from "react";
import { Service } from "../Shared/domain";
import { appFetch } from "../Shared/application/utils";

export function Login() {
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const redirect = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit() {
    const result = await appFetch<string>({
      service: Service.Auth,
      path: "/login",
      method: "POST",
      body: form,
      responseType: "text"
    });

    if (result.isOk()) {
      message.success("Logged in successfully");
      localStorage.setItem("token", result.unwrap());
      window.dispatchEvent(new Event("storage"));
      redirect("/");
    } else {
      message.error("Login failed");
      setShowErrors(true);
    }
  }

  const status = showErrors ? "error" : undefined;
  return (
    <div className={cs.container}>
      <div className={cs.card}>
        <h1>Login</h1>

        <p>
          Not yet registered?{" "}
          <b>
            <Link to="/register">Register</Link>
          </b>
        </p>

        <Form onFinish={handleSubmit}>
          <label htmlFor="email">Email</label>
          <Input
            placeholder="Email"
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            required
            status={status}
          />

          <label htmlFor="password">Password</label>
          <Input
            placeholder="*****"
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            required
            status={status}
          />

          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export function Register() {
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const redirect = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit() {
    const result = await appFetch<void>({
      service: Service.Auth,
      path: "/register",
      method: "POST",
      body: form,
      responseType: "void"
    });

    if (result.isOk()) {
      message.success("Registered successfully");
      redirect("/login");
    } else {
      message.error("Registration failed");
      setShowErrors(true);
    }
  }

  const status = showErrors ? "error" : undefined;

  return (
    <div className={cs.container}>
      <div className={cs.card}>
        <h1>Register</h1>

        <p>
          Already registered?{" "}
          <b>
            <Link to="/login">Login</Link>
          </b>
        </p>

        <Form onSubmitCapture={(e) => e.preventDefault()} onFinish={handleSubmit}>
          <label htmlFor="name">Name</label>
          <Input
            required
            placeholder="Name"
            id="name"
            type="text"
            name="name"
            onChange={handleChange}
            status={status}
          />

          <label htmlFor="email">Email</label>
          <Input
            required
            placeholder="Email"
            id="email"
            type="email"
            name="email"
            onChange={handleChange}
            status={status}
          />

          <label htmlFor="password">Password</label>
          <Input
            required
            minLength={8}
            placeholder="*****"
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            status={status}
          />

          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}
