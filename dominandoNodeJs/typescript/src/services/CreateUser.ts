//Interface para Array com varios tipo
interface TecObject {
  title: string;
  experience: number;
}

//Interface definir o tipo da variavel
interface CreateUserData {
  name?: string;
  email: string;
  password: string;
  techs: Array<string | TecObject>
}

//Tipagem
export default function createUser({name, email, password }: CreateUserData) {
  const user = {
    name,
    email,
    password,
  }

  return user;
}