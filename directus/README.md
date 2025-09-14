Directus configuration lives here. You can optionally add extensions or a schema snapshot later.

Quick tips:
- After first boot, visit the Directus admin URL, create collections as per the project README and generate a service token for the web app.
- To automate schema, you can export a snapshot with `npx directus schema snapshot schema.yaml` then apply with `npx directus schema apply schema.yaml`. Mount it into this folder and run from the container.

