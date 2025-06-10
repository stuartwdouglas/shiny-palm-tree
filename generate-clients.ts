import { generate } from 'openapi-typescript-codegen';
import * as fs from 'fs';
import * as path from 'path';

const MODULES = ['inventory', 'orders', 'payments', 'customers', 'shipping'];
const BASE_PATH = path.join(__dirname, 'realms/online-boutique');

async function generateClients() {
    for (const module of MODULES) {
        const modulePath = path.join(BASE_PATH, module);
        const functions = fs.readdirSync(modulePath);
        
        for (const func of functions) {
            const apiPath = path.join(modulePath, func, 'api/openapi.yaml');
            if (fs.existsSync(apiPath)) {
                const clientPath = path.join(__dirname, 'realms/online-boutique/clients', module, func);
                
                await generate({
                    input: apiPath,
                    output: clientPath,
                    clientName: `${func}Client`,
                    httpClient: 'axios'
                });

                console.log(`Generated client for ${module}/${func}`);
            }
        }
    }
}

generateClients().catch(console.error);