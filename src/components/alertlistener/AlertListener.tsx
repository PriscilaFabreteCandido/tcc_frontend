import  { useEffect } from 'react';

function AlertListener() {
  useEffect(() => {
    // Adicionando um ouvinte de evento personalizado para lidar com o evento 'alertMessage'
    const handleAlertMessage = (event: any) => {
      alert(event.detail.message);
    };

    window.addEventListener("alertMessage", handleAlertMessage);

    // Removendo o ouvinte quando o componente é desmontado
    return () => {
      window.removeEventListener("alertMessage", handleAlertMessage);
    };
  }, []); // O segundo argumento vazio [] garante que este efeito só seja executado uma vez

  return null; // Este componente não renderiza nada na interface do usuário
}

export default AlertListener;
