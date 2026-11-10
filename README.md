# GreavesLabs Maisy Runner Custom Error Service 🐕⛰️

An ultra-lightweight, high-performance custom error handling service and interactive endless runner game deployed across the GreavesLabs K3s cluster.

When Traefik Ingress intercepts an HTTP error (`404 Not Found`, `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, or `504 Gateway Timeout`), it proxies the request to this service. The service serves a branded, accessible error page featuring an interactive Chrome T-Rex style infinite runner where Maisy—a black working cocker spaniel with a white chest flash—runs across a Pennine-inspired landscape jumping dry stone walls and timber post-and-rail fences.

```
                          ┌─────────────────────────┐
                          │     Client Request      │
                          └────────────┬────────────┘
                                       │
                                       ▼
                          ┌─────────────────────────┐
                          │ Traefik Ingress Router  │
                          │   (K3s Cluster Core)    │
                          └────────────┬────────────┘
                                       │ Upstream 404 / 50x
                                       ▼
                          ┌─────────────────────────┐
                          │ Traefik ErrorMiddleware │
                          └────────────┬────────────┘
                                       │ Query: /{status}
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│ GreavesLabs Maisy Runner Pod (Namespace: kube-system)                  │
│                                                                        │
│  ┌─────────────────────────┐         ┌──────────────────────────────┐  │
│  │   NGINX Alpine Slim     │ ──────> │  Zero-dependency HTML5/2D    │  │
│  │  (Zero External CDNs)   │         │  (Embedded Inline Sprites)   │  │
│  └─────────────────────────┘         └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System & Visual Tokens

The user interface strictly inherits the warm minimalist, eco-tech aesthetic of [www.lewisgreaves.co.uk](https://www.lewisgreaves.co.uk) and [bins.greaveslabs.io](https://bins.greaveslabs.io).

### Brand Palette
- **Warm Cream (`#FAF7F2`)**: Base canvas and paper-like page substrate.
- **Sage Green (`#4A614E`)**: Primary structural framing, landscape ground, navigation accents.
- **Terracotta Clay (`#D47C59` / `#C26541`)**: Accent color for game-over states, primary CTAs, hover links.
- **Forest Charcoal (`#242A25`)**: High-contrast typography and ground level line.
- **Pure White (`#FFFFFF`)**: Distinct vertical chest flash on Maisy.

### Typography
- **Headings & Error Titles**: `Fraunces` (High-contrast organic serif with fallback `Georgia, serif`).
- **Body Copy & Instructions**: `Plus Jakarta Sans` (Clean modern sans-serif with fallback `system-ui, sans-serif`).
- **Telemetry & Scoreboard**: `Fira Code` (Monospace for request IDs, HTTP status codes, server hostnames).

---

## 🎮 Game Engine & Physics Specifications

- **Resolution**: Virtual 800x240 logic coordinate system, responsively auto-scaled with CSS letterboxing prevention.
- **Physics**:
  - Gravity: $1.6\text{ px/frame}^2$.
  - Initial Jump Velocity: $-14\text{ px/frame}$.
  - Variable Jump Height: Early release of `[SPACE]` cuts vertical momentum.
  - Speed Scaling: Base speed $6\text{ px/frame}$, accelerating by $+0.2\text{ px/frame}$ per 100 points, capped at $16\text{ px/frame}$.
  - Floor Clamp: Invariant ground clamp at $Y = 0$, guaranteeing Maisy never falls through terrain.
- **Collision Detection**: Axis-Aligned Bounding Box (AABB) using 4px internal inset margins to avoid frustrating hair/tail collision deaths.
- **Controls**:
  - `Space` / `ArrowUp` / Touch: Jump.
  - `ArrowDown`: Duck (40% hitbox reduction) and fast drop.

---

## 🧪 Unit Testing & Coverage

Vitest suite guarantees >95% code coverage across all core deterministic business logic:

```bash
npm run test:coverage
```

- `Physics.test.ts`: Jump curves over 30 sequential ticks, terminal velocity, variable height release cut.
- `Collision.test.ts`: Overlapping bounding boxes, near-miss 1–3px clearance, ducking hitbox height reduction.
- `Obstacles.test.ts`: Guaranteed minimum 350px spacing between obstacles (prevents unwinnable traps), speed sync.
- `Scoreboard.test.ts`: Linear frame increments, localStorage resilience when disabled or throwing QuotaExceededError.
- `ErrorContext.test.ts`: Status code extraction from URI paths (`/404`, `/502`), query parameters (`?code=500`), and Traefik headers (`X-Code`, `X-Status-Code`).

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## ☸️ Kubernetes & Traefik Integration

Deploy via Kustomize:

```bash
kubectl apply -k deploy/k8s/
```

Traefik Middleware Definition (`middleware.yaml`):

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: greaveslabs-error-pages
  namespace: kube-system
spec:
  errors:
    status:
      - "404"
      - "500-504"
    service:
      name: maisy-error-service
      port: 80
    query: "/{status}"
```
