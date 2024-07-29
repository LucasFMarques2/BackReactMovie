const {hash, compare} = require("bcryptjs")
const AppError = require("../utils/AppError")
const knex = require("../database/knex")

class UsersControllers{
    async create(req,res){
        try{
            const {name, email, password} = req.body

            const checkUsersExist = await knex("users").where({email}).first()
            console.log(checkUsersExist)
    
            if(checkUsersExist){
                throw new AppError("Este e-mail já está em uso.");
            }
    
            const hashedPassword = await hash(password, 8)
            
            await knex("users").insert({
                name,
                email,
                password: hashedPassword
            })
    
            return res.json()
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
     
    }

    async update(req,res){
        try{
            const {name, email, password, old_password} = req.body
        const {id} = req.params;
        const user = await knex("users").where({ id }).first();

        if(!user){
            throw new AppError("Usuário não encontrado")
        }

        if (email && email !== user.email) {
            const userWithUpdatedEmail = await knex("users").where({ email }).first();
            if (userWithUpdatedEmail) {
                throw new AppError("Email já está em uso");
            }
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga.");
        }
        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("Senha antiga incorreta.");
            }

            user.password = await hash(password, 8);
        }

        await knex("users").where({id}).update({
            name: user.name,
            email: user.email,
            password: user.password
        })

        return res.json();
        }catch(error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
        
    }
}

module.exports = UsersControllers