import http from 'http';
import { config } from 'dotenv';
import { serviceContainer } from './config/inversify.config';
import { LoggerInterface, Logger } from "./types/logger.types";
import app from './routers';

(async function main() {
    try {
        const loggerInstance = serviceContainer.get<LoggerInterface>(Logger);

        console.log("Successfully connected to db!");

        // @ts-ignore
        const { APP_PORT } = config().parsed;
        const server = http.createServer(app);

        server.listen(APP_PORT, function () {
            console.info(`Server is running on ${APP_PORT} port!`);

            process.on('uncaughtException', function ( err: Error ) {
                loggerInstance.logError(
                    `Error type: ${ err.name }\nError message: ${ err.message }\nError trace: ${ err.stack }`
                );
            });

            // @ts-ignore
            process.on('unhandledRejection', function ( reasonAny: any, p: Promise<any> ) {
                loggerInstance.logError(
                    `Error type: Promise unhandled\nReject message: ${ reasonAny }\n`
                );
            });
        })
    }
    catch (error) {
        console.error(error);
    }
}());