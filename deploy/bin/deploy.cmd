set environment=test
if not "%~1"=="" set environment=%1
docker compose run --rm -ti oauth-deploy ansible-playbook -i inventory.yml playbook.yml -l %environment%
