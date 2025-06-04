---
title: Día 67 - Seguridad y Compliance
description: Asegurar el cumplimiento de mejores prácticas de seguridad
sidebar_position: 4
---

### semana10
![](../../static/images/banner/10.png)

## Objetivo
Asegurar el cumplimiento de mejores prácticas de seguridad y compliance

## Actividades Principales

### 1. Implementar Escaneo de Vulnerabilidades
- **SAST**: Análisis estático de código
- **DAST**: Análisis dinámico de aplicaciones
- **Container scanning**: Escaneo de imágenes Docker
- **Dependency scanning**: Vulnerabilidades en dependencias

### 2. Automatizar Gestión de Secrets
- Rotación automática de passwords/tokens
- Cifrado de secrets en reposo y tránsito
- Principio de menor privilegio

### 3. Auditoría de Seguridad
- Revisión de permisos y accesos
- Análisis de logs de seguridad
- Verificación de políticas implementadas

## Entregables del Día

- [ ] Pipeline de seguridad automatizado
- [ ] Rotación de secrets configurada
- [ ] Reporte de auditoría completo

## Checklist de Seguridad

### Vulnerability Scanning
- [ ] SAST integrado en CI/CD
- [ ] DAST en ambiente de staging
- [ ] Container images escaneadas
- [ ] Dependencies actualizadas

### Secrets Management
- [ ] Secrets rotados automáticamente
- [ ] Vault/KeyVault configurado
- [ ] No hardcoded secrets en código
- [ ] Principio de menor privilegio aplicado

### Compliance & Audit
- [ ] Logs de auditoría habilitados
- [ ] Políticas de acceso documentadas
- [ ] Backup de configuraciones de seguridad
- [ ] Incident response plan actualizado

## Configuraciones de Seguridad

### GitLab CI - Security Pipeline
```yaml
stages:
  - security
  - deploy

sast:
  stage: security
  image: securecodewarrior/docker-sast
  script:
    - sast-scan --format json --output sast-report.json
  artifacts:
    reports:
      sast: sast-report.json
  only:
    - merge_requests
    - main

dependency_scanning:
  stage: security
  image: owasp/dependency-check
  script:
    - dependency-check.sh --project myapp --scan . --format JSON
  artifacts:
    reports:
      dependency_scanning: dependency-check-report.json

container_scanning:
  stage: security
  image: aquasec/trivy
  script:
    - trivy image --format json --output container-report.json $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  artifacts:
    reports:
      container_scanning: container-report.json
```

### Terraform - Secrets Management
```hcl
# AWS Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name                    = "db-password"
  recovery_window_in_days = 7
  
  rotation_rules {
    automatically_after_days = 30
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    username = "admin"
    password = random_password.db_password.result
  })
}

# Lambda para rotación automática
resource "aws_lambda_function" "rotate_secret" {
  filename         = "rotate_secret.zip"
  function_name    = "rotate-db-secret"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "python3.9"
  
  environment {
    variables = {
      SECRET_ARN = aws_secretsmanager_secret.db_password.arn
    }
  }
}
```

### Docker - Security Best Practices
```dockerfile
# Multi-stage build para reducir superficie de ataque
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:16-alpine AS runtime
# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Configurar permisos
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

# Usar usuario no-root
USER nextjs

# Exponer puerto no-privilegiado
EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

## Herramientas de Seguridad

### SAST Tools
```bash
# SonarQube
docker run -d -p 9000:9000 sonarqube:community
sonar-scanner -Dsonar.projectKey=myapp -Dsonar.host.url=http://localhost:9000

# Semgrep
pip install semgrep
semgrep --config=auto --json --output=semgrep-report.json

# CodeQL
codeql database create myapp-db --language=javascript
codeql database analyze myapp-db --format=json --output=codeql-results.json
```

### Container Security
```bash
# Trivy - Vulnerability scanner
trivy image --severity HIGH,CRITICAL nginx:latest

# Hadolint - Dockerfile linter
hadolint Dockerfile

# Docker Bench Security
docker run -it --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib:ro \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --label docker_bench_security \
  docker/docker-bench-security
```

## Políticas de Compliance

### RBAC Configuration
```yaml
# Kubernetes RBAC
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer-role
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "create", "update", "patch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "patch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
subjects:
- kind: User
  name: developer@company.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer-role
  apiGroup: rbac.authorization.k8s.io
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web-to-api
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: web
    ports:
    - protocol: TCP
      port: 8080
```

## Checklist de Auditoría

### Infrastructure Security
- [ ] Todos los recursos tienen tags de owner
- [ ] Principio de menor privilegio aplicado
- [ ] MFA habilitado para todos los usuarios
- [ ] Logs de auditoría configurados
- [ ] Backups cifrados

### Application Security
- [ ] Secrets no hardcodeados
- [ ] Input validation implementada
- [ ] HTTPS everywhere
- [ ] Security headers configurados
- [ ] Rate limiting implementado

### Compliance
- [ ] Políticas de retención de datos
- [ ] Incident response plan documentado
- [ ] Business continuity plan actualizado
- [ ] Disaster recovery probado
- [ ] Security training completado

## Métricas de Seguridad
- **Vulnerabilidades críticas**: 0
- **Tiempo de parcheo**: < 48 horas
- **Rotación de secrets**: 100% automatizada
- **Cobertura de escaneo**: 100% del código

## Comandos de Auditoría

### AWS Security
```bash
# Verificar configuración de S3
aws s3api get-bucket-encryption --bucket my-bucket
aws s3api get-bucket-versioning --bucket my-bucket

# Auditar IAM
aws iam generate-credential-report
aws iam get-credential-report

# CloudTrail logs
aws logs describe-log-groups --log-group-name-prefix CloudTrail
```

### Kubernetes Security
```bash
# Verificar RBAC
kubectl auth can-i --list --as=system:serviceaccount:default:myapp

# Network policies
kubectl get networkpolicies --all-namespaces

# Pod security
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.securityContext}{"\n"}{end}'
```

## Notas Importantes
- Nunca comprometer seguridad por velocidad
- Automatizar tanto como sea posible
- Documentar todas las excepciones
- Revisar logs de seguridad regularmente
- Mantener inventario de assets actualizado