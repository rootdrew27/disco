class DiscoUser implements Express.User {
	id: number;
	username: string;
	constructor(id: number, username: string){
		this.id = id;
		this.username = username;
	}
}

export default DiscoUser;