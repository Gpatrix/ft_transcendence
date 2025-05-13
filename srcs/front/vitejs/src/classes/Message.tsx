class Message {
	static id: number = 0;
	id: number = 0;
	idSender: number;
	idTarget: number;
	date: Date;
	content: string;



	constructor(idSender: number, idTarget: number, date: Date, content: string) {
		this.id = Message.id++;
		this.idSender = idSender;
		this.idTarget = idTarget;
		this.date = date;
		this.content = content;
	}

	updateDate(newDate: Date) {
		this.date = newDate;
	}

	updateContenu(newContent: string) {
		this.content = newContent;
	}

	getUserInfo() {
		return `ID: ${this.id}, Nom: ${this.date}, Contenu: ${this.content}`;
	}

	static sendMessage =  (idSender:number, targetId: number, message: string, socket: WebSocket) => {
		
		try {
			socket.send(JSON.stringify({ action: 'msg', targetId: targetId, msg: message}));

		return (new Message(idSender, targetId, new Date(), message));
		} catch (error) {
			console.error("Erreur lors de l'envoi de la demande des requetes :", error);
		}
	}
}

export default Message;
