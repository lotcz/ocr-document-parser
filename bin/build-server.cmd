set environment=windows
if not "%~1"=="" set environment=%1
.\mvnw.cmd clean package -P %environment%
