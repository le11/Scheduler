import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { login } from "../../services/auth";
import api from "../../services/api";
import "./styles.css";
// import "normalize.css";
// import { render } from "@testing-library/react";
import imgCalendar from "../../resources/calendar2.png";

class Login extends Component {
  // componentDidMount() {
  //     const logado = true;
  //     if (logado === true) {
  //         this.props.history.push('/calendar');
  //     }
  //  }

  state = {
    user: "",
    pass: "",
    error: "",
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { user, pass } = this.state;
    if (!user || !pass) {
      this.setState({ error: "Preencha usuário e senha para continuar!" });
    } else {
      try {
        const response = await api.post("/user/login", {
          user,
          pass,
          domain: process.env.REACT_APP_DOMAIN,
        });
        response.status === 200
          ? login(response.data.token)
          : this.setState({ error: "Login inválido!" });
        this.props.history.push("/calendar");
      } catch (err) {
        this.setState({
          error: "Usuário ou senha inválido!",
        });
      }
    }
  };

  render() {
    return (
      <div id="login-page">
        <img src={imgCalendar} alt="calendar" />
        <form onSubmit={this.handleSubmit}>
          <h1>Login</h1>
          {this.state.error && <p>{this.state.error}</p>}
          <div id="inputs">
            <div className="field">
              <input
                type="text"
                name="user"
                id="user"
                placeholder="nome.sobrenome"
                onChange={(e) => this.setState({ user: e.target.value })}
                // onMouseOut={handleUser}
              />
            </div>

            <div className="field">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="senha"
                onChange={(e) => this.setState({ pass: e.target.value })}
              />
            </div>
          </div>
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
