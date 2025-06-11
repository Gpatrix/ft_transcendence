
// A utiliser pour passer un user en props ?
// interface UserProps {
//   id: number;
//   name: string;
//   email: string;
// }


class User {
	id: number;
	name: string;
	email: string;
	profPicture: string;
	bio: string;
	lang : string;
	isTwoFactorEnabled : boolean;
	rank: number;
	provider?: string;

	constructor(id: number, name: string, email: string, profPicture:string, bio:string, lang : string, isTwoFactorEnabled : boolean, rank: number, provider?: string) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.profPicture = profPicture;
		this.bio = bio;
		this.lang = lang;
		this.isTwoFactorEnabled = isTwoFactorEnabled;
		this.rank = rank;
		this.provider = provider;
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

	static async getUserById(userId: number): Promise<User | string> {
		try {
			const requestData : RequestInit = {
				method :  'GET',
				credentials: 'include'
			}
			const response = await fetch(`/api/user/get_profile/${userId}`, requestData);

			const dataReponse = await response.json();

			if (dataReponse.error)
				return (dataReponse.error)
			
			dataReponse.data.id = userId;

			return (dataReponse.data as User);

		} catch (error) {
			return ("0500")
		}
	}

	static async searchUserByName(name: string): Promise<User[] | string> {
		try {
			const requestData : RequestInit = {
				method :  'GET',
				credentials: 'include'
			}
			const response = await fetch(`/api/user/${name}`, requestData);

			const dataReponse = await response.json();

			if (dataReponse.error)
				return (dataReponse.error);
			return (dataReponse);

		} catch (error) {
			return ("0500")
		}
	}
}

export default User;
