
// A utiliser pour passer un user en props ?
// interface UserProps {
//   id: number;
//   name: string;
//   email: string;
// }

import { data } from "react-router";

class User {
  id: number;
  name: string;
  email: string;
  profPicture: string;
  bio: string;
  rank: number;

  constructor(id: number, name: string, email: string, profPicture:string, bio:string, rank: number) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.profPicture = profPicture;
    this.bio = bio;
    this.rank = rank;
  }

  updateName(newName: string) {
    this.name = newName;
  }

  updateEmail(newEmail: string) {
    this.email = newEmail;
  }

  updateprofPicture(newProfPicture: string) {
    this.profPicture = newProfPicture;
  }

  updateBio(newBio: string) {
    this.bio = newBio;
  }

  updateRank(newRank: number) {
    this.rank = newRank;
  }

  getUserInfo() {
    return `ID: ${this.id}, Nom: ${this.name}, Email: ${this.email}, ProfPicture: ${this.profPicture}`;
  }


  static findUserById(users: User[], userId: number): User | undefined {
    return users.find(user => user.id === userId);
  }

  static async getUserById(userId: number): Promise<User | undefined> {
    
      // return (user)

      try {
		const requestData : RequestInit = {
			method :  'GET',
			credentials: 'include'
		}
		const response = await fetch(`/api/user/get_profile/${userId}`, requestData);

		const dataReponse = await response.json();
		
		return (dataReponse.data as User);
		// return (dataReponse);

	} catch (error) {
		console.error("Erreur lors de l'envoi de la demande :", error);
		return (undefined)
	}
  }
}

export default User;
