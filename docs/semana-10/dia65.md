---
title: Día 65 - Automatización de Infraestructura
description: Completar la automatización de infraestructura con IaC
sidebar_position: 2
---

### semana10
![](../../static/images/banner/10.png)

## Objetivo
Completar la automatización de infraestructura usando Infrastructure as Code

## Actividades Principales

### 1. Refinar Scripts de IaC
- **Terraform/CloudFormation**: Optimizar recursos existentes
- **Modularización**: Crear módulos reutilizables
- **Variables**: Parametrizar configuraciones

### 2. Implementar Auto-scaling
- Configurar escalado automático de instancias
- Definir métricas de escalado (CPU, memoria, requests)
- Establecer límites mínimos y máximos

### 3. Configurar Backups Automáticos
- Snapshots programados de volúmenes
- Backup de bases de datos
- Política de retención de backups

## Entregables del Día

- [ ] Scripts IaC refinados y modularizados
- [ ] Auto-scaling configurado y probado
- [ ] Sistema de backup automático funcionando

## Checklist de Automatización

### Infrastructure as Code
- [ ] Código IaC versionado en Git
- [ ] Módulos reutilizables creados
- [ ] Variables de entorno configuradas
- [ ] Plan de ejecución validado

### Auto-scaling
- [ ] Políticas de escalado definidas
- [ ] Métricas de monitoreo configuradas
- [ ] Límites de recursos establecidos
- [ ] Pruebas de carga realizadas

### Backups
- [ ] Schedules de backup configurados
- [ ] Políticas de retención definidas
- [ ] Pruebas de restauración exitosas
- [ ] Notificaciones de backup configuradas

## Ejemplos de Código

### Terraform - Auto Scaling Group
```hcl
resource "aws_autoscaling_group" "web" {
  name                = "web-asg"
  vpc_zone_identifier = var.subnet_ids
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  
  min_size         = 2
  max_size         = 10
  desired_capacity = 3
  
  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "web-server"
    propagate_at_launch = true
  }
}
```

### CloudFormation - Backup Policy
```yaml
BackupPlan:
  Type: AWS::Backup::BackupPlan
  Properties:
    BackupPlan:
      BackupPlanName: DailyBackups
      BackupPlanRule:
        - RuleName: DailyBackupRule
          TargetBackupVault: !Ref BackupVault
          ScheduleExpression: cron(0 2 * * ? *)
          StartWindowMinutes: 60
          CompletionWindowMinutes: 120
          Lifecycle:
            DeleteAfterDays: 30
```

### Ansible - Server Configuration
```yaml
---
- name: Configure web servers
  hosts: web_servers
  become: yes
  tasks:
    - name: Install required packages
      package:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - docker
        - docker-compose
    
    - name: Start and enable services
      systemd:
        name: "{{ item }}"
        state: started
        enabled: yes
      loop:
        - nginx
        - docker
```

## Métricas de Éxito
- **Tiempo de aprovisionamiento**: < 10 minutos
- **Uptime de infraestructura**: > 99.9%
- **Tiempo de recuperación**: < 5 minutos
- **Backups exitosos**: 100%

## Comandos Útiles

### Terraform
```bash
# Validar configuración
terraform validate

# Plan de cambios
terraform plan -out=tfplan

# Aplicar cambios
terraform apply tfplan

# Destruir recursos (cuidado!)
terraform destroy
```

### AWS CLI - Testing Auto Scaling
```bash
# Simular alta carga
aws cloudwatch put-metric-data \
  --namespace "AWS/EC2" \
  --metric-data MetricName=CPUUtilization,Value=80,Unit=Percent

# Verificar estado del ASG
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names web-asg
```

## Notas Importantes
- Siempre probar en entorno de desarrollo primero
- Verificar costos antes de aplicar cambios
- Documentar todas las configuraciones
- Mantener backups antes de modificaciones importantes