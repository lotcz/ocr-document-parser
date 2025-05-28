call bin\build-server.cmd linux
cd deploy && bin\deploy.cmd %1 && cd ..
