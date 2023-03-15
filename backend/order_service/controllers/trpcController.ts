import {userRepository} from "../../shared/data/impl_pocketbase_server";


export const trpcController = {
    ping: async (message: string): Promise<string> => {
        let user = await userRepository.getByUsername('bloggalyny');
        return `Message: ${user.name} \n token ${message}`;
    },
};