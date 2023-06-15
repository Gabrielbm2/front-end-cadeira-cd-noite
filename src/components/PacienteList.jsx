/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { Input, List, Button, Modal, message, Space, Descriptions } from 'antd';
import { PacienteContext } from '../context/PacienteContext';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useMemo } from 'react';

const { Search } = Input;

const PacienteList = () => {
  const { pacientes, loading, fetchPacientes } = useContext(PacienteContext);
  const [searchText, setSearchText] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const filteredPacientes = useMemo(()=> {
    return pacientes.filter((paciente) =>
    paciente.name.toLowerCase().includes(searchText.toLowerCase()) || paciente.nat.toLowerCase().includes(searchText.toLowerCase())
  );
  }, [searchText, pacientes])

  const location = useLocation();

  const handleLoadMore = () => {
    fetchPacientes();
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };


  const handleViewPaciente = (paciente) => {
    setSelectedPaciente(paciente);
  };

  const handleCloseModal = () => {
    setSelectedPaciente(null);
  };

  const shareUrl = useMemo(() => `${window.location.origin}/paciente/${selectedPaciente?.id?.value}`, [selectedPaciente]);

  useEffect(() => {
    if (location?.pathname.includes("/paciente/")) {
      const pacienteId = location?.pathname.split("/paciente/")[1]
      const paciente = pacientes.find(paciente => {
        console.log({ paciente: paciente.id.value, pacienteId })
        if (paciente.id.value === pacienteId) return paciente

      })
      setSelectedPaciente(paciente)
    }
  }, [location, pacientes])

  return (
    <div>
      <Search
        placeholder="Buscar pacientes"
        allowClear
        enterButton="Buscar"
        onSearch={handleSearch}
      />
      <List
        dataSource={filteredPacientes}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => handleViewPaciente(item)}
                key="view"
              >
                <p>Visualizar</p>
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`Gênero: ${item.gender}`}
            />
          </List.Item>
        )}
      />
      {loading && <div>Carregando...</div>}
      {!loading && (
        <Button onClick={handleLoadMore} disabled={loading}>
          Carregar mais
        </Button>
      )}
      <Modal
        visible={!!selectedPaciente}
        title="Detalhes do Paciente"
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Fechar
          </Button>,
          <Button
            key="share"
            type="primary"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              message.success('URL copiada para a área de transferência');
            }}
          >
            Copiar URL de Compartilhamento
          </Button>,
        ]}
      >
        {selectedPaciente?.name && (
          <Space direction="vertical">
            <img src={selectedPaciente?.picture?.large} alt="Paciente" />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nome completo">
                {selectedPaciente?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedPaciente?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Gênero">
                {selectedPaciente?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Data de Nascimento">
                {selectedPaciente?.dob?.date}
              </Descriptions.Item>
              <Descriptions.Item label="Telefone">
                {selectedPaciente?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Nacionalidade">
                {selectedPaciente?.nat}
              </Descriptions.Item>
              <Descriptions.Item label="Endereço">
                {selectedPaciente?.location?.city}, {selectedPaciente?.location?.state} - {selectedPaciente?.location?.country}
              </Descriptions.Item>
              <Descriptions.Item label="ID">
                {selectedPaciente?.id?.name} : {selectedPaciente?.id?.value}
              </Descriptions.Item>
              <Descriptions.Item label="URL para compartilhamento">
                {shareUrl}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default PacienteList;
