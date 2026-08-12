# WeatherDashboard
Interactive weather dashboard with real-time forecasts and visualizations

## 🛠️ Workflow Diagram

![Workflow Diagram](docs/workflow.png)
## 🛠️ Workflow Diagram

```mermaid
flowchart TD
    A[User Interface (Frontend)] --> B[Weather API Layer]
    B --> C[Backend (Optional)]
    C --> D[Data Visualization]
    D --> E[Deployment]

    A -->|React/HTML/CSS| B
    B -->|OpenWeatherMap API| C
    C -->|Node.js/Express| D
    D -->|Chart.js / D3.js| E
    E -->|GitHub Actions + Netlify/Hostinger| F[Live Dashboard]
