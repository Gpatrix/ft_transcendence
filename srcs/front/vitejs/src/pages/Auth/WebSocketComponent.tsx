import { useEffect } from 'react';

const WebSocketComponent = () => {
    useEffect(() => {
        // ou recuperation du tocken
        const token = localStorage.getItem('ft_transcendence_jw_token'); 

        if (!token) {
            console.error('Token JWT manquant');
            return;
        }

        // Tu peux envoyer le token dans le header
        const socket = new WebSocket(`ws://localhost/api/chat/connect`, [
            `Authorization: Bearer ${token}` 
        ]);

        // Connexnion
        socket.onopen = () => {
            console.log('WebSocket connecté');
        };

        // Recuperation des messages
        socket.onmessage = (event) => {
            const data = event.data;
            console.log('Message reçu:', data);
        };

        // Fermeture de la connexion
        socket.onclose = () => {
            console.log('WebSocket fermé');
        };

        // Gestion des erreurs
        socket.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return <div>WebSocket Test</div>;
};

export default WebSocketComponent;
