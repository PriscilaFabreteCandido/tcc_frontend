import  { useState } from 'react';
import { Calendar, Button, Tag } from 'antd';


const Home = () => {
  const [view, setView] = useState('month'); // Estado para alternar entre 'month' e 'day'
  const [selectedDate, setSelectedDate] = useState<any>(null); // Data selecionada

  const onSelect = (date:any) => {
    setSelectedDate(date);
    setView('day');
  };

  const onPanelChange = (date:any, mode:any) => {
    console.log('date',date)
    if (mode === 'month') {
      setView('month');
    }
  };

  const renderMonthView = () => (
    <div>
      <Calendar onSelect={onSelect} onPanelChange={onPanelChange} />
    </div>
  );

  const renderDayView = () => (
    <div>
      <Button onClick={() => setView('month')}>Ver Mês</Button>
      <h2>Visualização do Dia: {selectedDate ? selectedDate.format('YYYY-MM-DD') : 'Nenhum dia selecionado'}</h2>
    </div>
  );

  return (
    <div>

      {view === 'month' ? renderMonthView() : renderDayView()}
      <div style={{ marginTop: 20 }}>
        <h6>Legenda:</h6>
        <Tag color="green">Projeto</Tag>
        <Tag color="pink">Curso</Tag>
        <Tag color="brown">Visita guiada</Tag>
      </div>
      
    </div>
  );
};

export default Home;
