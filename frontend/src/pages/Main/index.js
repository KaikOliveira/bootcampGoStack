import React, { useState } from 'react';

import { FaGithubAlt, FaPlus } from 'react-icons/fa';

import api from '../../services/api';

import { Conteiner, Form, SubmitButton } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');

  async function handlerSubmit(e) {
    e.preventDefault();

    const response = await api.get(`/repos/${newRepo}`);
    console.log(response.data);
  }

  return (
    <Conteiner>
      <h1>
        <FaGithubAlt />
        Repositorios
      </h1>

      <Form onSubmit={handlerSubmit}>
        <input
          type="text"
          placeholder="Adicionar repositorio"
          onChange={(e) => setNewRepo(e.target.value)}
          value={newRepo}
        />

        <SubmitButton>
          <FaPlus color="#fff" size={14} />
        </SubmitButton>
      </Form>
    </Conteiner>
  );
}
