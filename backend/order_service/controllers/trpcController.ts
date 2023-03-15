export const trpcController = {
    ping: async (message: string): Promise<string> => {
        return `Message: ${message}`;
    },
};