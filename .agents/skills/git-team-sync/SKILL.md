---
name: git-team-sync
description: >-
  Use this skill to guide and execute Git branching, commit conventions, and daily synchronization routines
  for the two developers (Jeremy Acosta and Eli Araujo) ensuring zero conflicts and clean isolation.
---

# Flujo de Trabajo: Sincronización en Git para 2 Desarrolladores

Protocolo técnico oficial de integración continua establecido en el Capítulo 5 del Informe Técnico de Tesis (USM 2026).

## Modelo de Ramas (Git Branching Strategy)

- `main`: Rama de código en producción y defensa de tesis (solo merges validados).
- `dev`: Rama de integración continua (donde ambos desarrolladores unen su trabajo diario).
- `feature/jeremy-<modulo>`: Rama personal de desarrollo para Jeremy Acosta.
- `feature/eli-<modulo>`: Rama personal de desarrollo para Eli Araujo.

## Protocolo Diario Obligatorio

### Al Iniciar la Jornada (Recibir Cambios del Compañero)
```bash
git checkout dev
git pull origin dev
git checkout feature/tu-nombre-modulo
git merge dev
```

### Durante el Desarrollo (Convención de Commits Semánticos)
Usar el estándar de Conventional Commits:
- `feat(admision): apertura de expediente formato 052`
- `feat(recetas): generacion de codigo qr inmutable`
- `fix(auth): correccion de expiracion en tokens jwt`
- `docs(tesis): actualizacion de esquemas y manual tecnico`

### Al Finalizar la Tarea Probada en Vivo
```bash
git add .
git commit -m "feat(modulo): descripcion clara y profesional del avance"
git push origin feature/tu-nombre-modulo
```

### Integración en `dev`
1. Abrir Pull Request hacia `dev` o solicitar revisión cruzada al compañero.
2. Comprobar que el backend (`pytest` / smoke test) y frontend (`npm run build`) compilen al 100%.
3. Realizar el merge en `dev`.
