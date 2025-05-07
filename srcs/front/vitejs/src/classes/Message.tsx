class Message {
  id: number;
  date: Date;
  content: string;

  constructor(id: number, date: Date, content: string) {
    this.id = id;
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
}

export default Message;
