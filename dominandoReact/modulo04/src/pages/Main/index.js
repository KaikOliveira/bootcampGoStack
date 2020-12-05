import React, { useState } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Conteiner, Form, SubmitButton } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handlerSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };
    setRepositories(data);

    console.log(repositories);
    setLoading(false);
    console.log(loading);
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

        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>
    </Conteiner>
  );
}
