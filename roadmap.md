---
layout: guide
title: "From Junior to Top 1% Backend Engineer"
subtitle: "A deliberate-practice program, built around your actual stack (Node.js + AWS)"
nav_title: Roadmap
tags: [Node.js, AWS, Backend, Distributed Systems, Performance]
permalink: /roadmap/
---

**Owner:** Bhavesh · **Started:** _____ · **Reviewed:** at each gate (§11)

---

## 0. Read this before anything else

### 0.1 How this plan is structured: units and gates, not dates

There are no dates in this document. Nothing says "by week 6" or "in month four." Instead the plan is built from two things:

- **Units** — a single self-contained thing to master. Each one names what to study, what to build, what to break, what to measure, and what artifact you end up with. You work one unit at a time, and you move on when the artifact exists and you can explain the thing without notes.
- **Gates** — a small set of capabilities you must demonstrate before advancing to the next stage (§11). Gates are the only checkpoints. They're passed by demonstrating the capability, not by elapsed time.

The ordering of stages is real and load-bearing — you cannot reason about distributed systems before you can reason about one process on one machine, and you cannot reason about one process before you can measure it. Within a stage, the units are also sequenced deliberately. But how long any of it takes is yours to determine, and it will vary enormously depending on what your job throws at you.

**The one thing that is fixed** is the session structure in §2. Content flexes; the habit doesn't.

### 0.2 The single idea that matters most

Most engineers with 5 years of experience have **1 year of experience repeated 5 times**. They ship features, the features work, and nothing forces them to understand the layer below. The top 1% are not smarter. They have a habit that compounds:

> **They refuse to use a thing they cannot explain, and they refuse to believe an explanation they haven't measured.**

Everything in this document is machinery for building that habit.

### 0.3 The engine: the R.R.B.M.W. loop

Every topic in this plan goes through five stages. Skipping stages is how people spend 200 hours on tutorials and stay junior.

| Stage | What you do | Time split | Failure if skipped |
|---|---|---|---|
| **R — Read** | Primary source only: official docs, source code, the paper, the book chapter. Not a blog summary. | 20% | You learn folklore |
| **R — Rebuild** | Implement a crude version of the thing from scratch, no library | 35% | You have vocabulary, not understanding |
| **B — Break** | Deliberately make it fail: overload it, kill it mid-write, add 300ms latency, exhaust its memory | 15% | You only know the happy path — worthless in production |
| **M — Measure** | Benchmark it. Get a number. Change one variable. Get another number. Explain the delta. | 20% | You have opinions instead of knowledge |
| **W — Write** | 300–800 words explaining it to a competent engineer who's never seen it | 10% | It evaporates in 3 weeks |

**Rule:** a topic is not "done" until the write-up exists. No write-up, no credit. This is the highest-leverage rule in the document — writing is where fuzzy understanding gets exposed as fuzzy.

### 0.4 Six standing rules

1. **No tutorials without a build.** If you watch or read something, you must produce a running artifact within 48 hours or the time doesn't count.
2. **Benchmark before you optimize, always.** "It felt faster" is a career-limiting phrase. Get a p50, p95, p99 and a throughput number.
3. **One notebook, forever.** Every write-up goes in the same place (Obsidian, or a private Git repo of markdown — Notion works since you already use it, but a Git repo makes your notes greppable and diffable). Never lose a note.
4. **Read the source when the docs are ambiguous.** Node, Express, ioredis, the Mongo driver — all readable. This is the single biggest gap between mid and senior.
5. **Every incident at work becomes a study.** Write a personal postmortem even if the company doesn't ask for one. This is free, high-density, real-world curriculum that no course can give you.
6. **Ship something public at every gate.** Blog post, OSS PR, benchmark repo. Public work forces a quality bar that private work never does.

### 0.5 Set up your environment first, before any unit

You develop on Windows. **This will actively hold you back** for everything in Phases 1 and 3, because the concepts (epoll, file descriptors, cgroups, `perf`, `strace`, `tcpdump`, container internals) are Linux concepts and your production runtime is Linux on Fargate.

Non-negotiable setup:

- **WSL2 with Ubuntu 24.04.** Do all project work inside the WSL filesystem (`~/`), not `/mnt/c/` — cross-filesystem I/O is 10x slower and will corrupt your benchmarks.
- **Docker Desktop with the WSL2 backend**, or Docker inside WSL directly.
- **Node via `nvm`** inside WSL, not the Windows installer. You need to switch versions to compare behavior.
- **VS Code Remote-WSL** (you already use VS Code — install the WSL extension so the terminal, debugger and file watcher all run Linux-side).
- Install now, you'll use them constantly: `htop`, `strace`, `ltrace`, `tcpdump`, `iproute2`, `linux-tools-common` (for `perf`), `postgresql-client`, `redis-tools`, `jq`, `hyperfine`, `wrk`.
- **A single Git repo called `lab/`.** Every experiment gets a numbered folder: `lab/001-event-loop-phases/`, `lab/002-tcp-backpressure/`. With a `README.md` in each stating: hypothesis, method, numbers, conclusion. This repo becomes the most valuable thing you own, faster than you'd expect.

---

## 1. Where you are, and what "top 1%" actually means

"Top 1% backend engineer" is not a single skill — it's an unusual *combination*. Plenty of engineers are strong on one axis. Almost nobody is strong on six. Here are the eight axes that matter, with honest level definitions.

Score yourself 1–5 on each **now**, in writing, and re-score at every gate. Be harsh; inflated self-assessment is the enemy here.

| # | Axis | L1 (where most juniors are) | L3 (solid senior) | L5 (top 1%) |
|---|---|---|---|---|
| 1 | **Runtime depth** (Node/V8/libuv) | Uses async/await correctly | Knows event loop phases, streams, backpressure; can read a flame graph | Can diagnose a GC pause or event-loop stall from production metrics alone; knows when to leave Node |
| 2 | **Data systems** | Writes queries, adds indexes when slow | Reads query plans, designs schemas for access patterns, understands isolation levels | Predicts index behavior before measuring; designs for 100x growth; knows storage engine internals |
| 3 | **Distributed systems** | Uses SQS/queues | Understands idempotency, at-least-once, retries with jitter, outbox pattern | Reasons about consistency models and partial failure by default; designs systems that degrade instead of collapse |
| 4 | **Performance & observability** | Reads logs | Uses metrics + traces, can profile CPU and heap | Builds the observability *before* the incident; drives systems to SLOs with error budgets |
| 5 | **OS & networking** | Knows what a port is | Understands TCP, TLS, timeouts, connection pooling, container limits | Debugs with `tcpdump`/`perf`; knows how the kernel schedules their container's CPU |
| 6 | **Architecture** | Follows existing patterns | Designs a service end-to-end, writes design docs | Decides what *not* to build; models the domain; makes reversible-vs-irreversible calls explicitly |
| 7 | **Security** | Hashes passwords, uses HTTPS | Threat models, knows OWASP, handles authz properly | Designs for multi-tenant isolation and blast-radius containment as a default |
| 8 | **Communication & influence** | Writes clear PRs | Writes design docs others act on, reviews well, mentors | Changes what a whole org builds through writing and judgment |

**The honest observation about axis 8:** almost every "10x engineer" you'll meet is a 4 on the technical axes and a 5 on communication. Technical depth alone caps out around senior. Depth *plus* the ability to make other people's work better is what actually puts you in the top 1%. Do not treat sections about writing as optional filler — they're the differentiator.

### Your starting position (based on what you're already working on)

You're further along than "junior" implies on a few axes, and that changes the plan:

- You've already built a **three-layer search system** (OpenSearch → Redis → DocumentDB) with edge-ngram indexing, a Change Streams sync worker, and an S3→SQS→Lambda pipeline. That's genuinely a mid-level system. What's probably missing is that you built it by pattern-matching rather than from first principles — you can't yet predict its failure modes or state its throughput ceiling.
- You're doing **DocumentDB optimization, Redis eviction/TTL work, ALB troubleshooting, Step Functions orchestration**. That's real production surface area — most people with 1.3 years have never touched it.
- The gap is almost certainly: **relational depth (you have very little), Linux/network fundamentals, distributed-systems reasoning, and measurement discipline.**

So this plan front-loads fundamentals and measurement rather than more AWS services. **More AWS services is the trap.** Services are learnable in a week when you need them; the fundamentals underneath take years and are what let you learn a new service in a week.

---

## 2. Your operating system (the rhythm that never changes)

This is the part that actually determines whether you succeed. Protect the rhythm above the content.

### 2.1 The four kinds of session

There are only four. Everything in this plan happens inside one of them.

| Session | Duration | What happens |
|---|---|---|
| **Deep block** | 75–90 min | The current unit's study and practice. R.R.B.M. stages. Phone in another room. No Slack, no email. This is the engine — everything else is support. |
| **Field notes** | ~10 min, ad hoc | Keep a scratch file open while you work. Every time you hit something you don't fully understand — a slow query, a weird timeout, an alarm — write one line. This is your personalized curriculum, and it's better than any syllabus. |
| **Write block** | 25–30 min | Write up what the deep block taught you, or answer one question from your field notes. A unit isn't finished until this exists. |
| **Long block** | 3–4 h, uninterrupted | Project work from the project ladder (§8). Builds need contiguous time; they don't fit in 90-minute slices. |

**On volume, without prescribing a calendar:** the thing that determines whether this works is *continuity*, not intensity. A modest, uninterrupted habit compounds; a heroic burst followed by three weeks of nothing does not. If you want a number to sanity-check against, this program is roughly 1,400–1,500 hours of deliberate work end to end — which tells you it's a long game and should be paced like one.

### 2.2 Non-negotiables about the deep block

- **Make it automatic, not a decision.** Same trigger, same place, same setup every time. Decision fatigue kills more learning plans than difficulty does.
- **Start the timer before you feel ready.** The first 10 minutes always feel bad.
- **End mid-problem.** Stop while you still know your next step — it makes restarting trivial (this is the Hemingway trick, and it works).
- **A miss is a miss, not a failure.** Never miss twice in a row. That's the only streak rule that matters.

### 2.3 The review ritual (90 min, whenever a stage's units are done)

1. Re-score the 8 axes. Note movement.
2. Re-read the write-ups you accumulated in this stage. Are they good enough to publish? Publish one.
3. Check the gate criteria for the stage (§11). If you can't demonstrate them, you're not through the gate — go back to the weak units. This is the entire point of gates.
4. Pick one thing at work that scares you slightly, and volunteer for it.

---

## 3. Stage 1 — The Machine Underneath

**Goal of this stage:** stop treating Node, Linux and the network as magic. By the end you should be able to explain, with numbers, exactly where every millisecond of a request goes.

**Why this first:** everything else in the plan sits on top of it. You cannot reason about a distributed system if you can't reason about one process on one machine.

---

### 3.1 Stage 1 units, in order

Each row is one unit: a deep block (or several) plus its write block. "Lab" refers to a numbered folder in your `lab/` repo. Move on when the deliverable exists.

#### Group A — The event loop, for real

| Unit | What to do | Deliverable |
|---|---|---|
| Event loop phases | Read the official Node "Event Loop, Timers, and process.nextTick()" guide **and** the libuv design overview. Then write the six phases from memory (timers → pending callbacks → idle/prepare → **poll** → check → close callbacks). Lab: log the ordering of `setTimeout(fn,0)`, `setImmediate`, `process.nextTick`, `Promise.resolve().then` — first at module top level, then inside an `fs.readFile` callback. | `lab/001-event-loop-order/` + explanation of *why* timeout-vs-immediate is nondeterministic at top level but deterministic inside I/O |
| Microtask starvation | Write a recursive `process.nextTick` and a recursive promise chain that starve the loop. Instrument with `perf_hooks.monitorEventLoopDelay()`. Watch a pending HTTP request never get served. | Lab + a one-paragraph rule for when `nextTick` is dangerous |
| The libuv thread pool | Understand what actually goes to the 4-thread pool: `fs`, `dns.lookup`, `crypto.pbkdf2/randomBytes`, zlib — and what doesn't (network I/O, which uses epoll). Benchmark 8 concurrent `pbkdf2` calls at `UV_THREADPOOL_SIZE=4` vs `=16`. | Numbers table showing the queuing effect |
| Blocking the loop | Add a 200ms synchronous CPU burn to an Express handler. Load test at 50 concurrent. Record p50/p99. Move it to `worker_threads`. Re-test. | Before/after latency table — this is your first real benchmark |
| Streams I: the pull model | Read the `stream` docs properly. Understand `highWaterMark`, readable modes (flowing vs paused), and why `data` events and `read()` differ. | Lab: hand-written Readable + Writable |
| **Build:** raw HTTP server | Using only the `net` module, accept TCP connections, parse the request line and headers yourself, respond with a valid HTTP/1.1 response, and support `keep-alive`. No Express, no `http` module. | `lab/006-raw-http-server/` |
| **Write-up & publish** | Write "How the Node event loop actually schedules your code" — 800 words, with your own diagrams and your own measurements. Publish it. | First public post |

#### Group B — Streams, backpressure, and memory

| Unit | What to do | Deliverable |
|---|---|---|
| Backpressure | Prove it: pipe a fast source into a slow sink *without* respecting `write()`'s return value and watch RSS climb. Then do it with `pipeline()`. Chart memory both ways. | Memory-over-time chart |
| Transforms & async iterators | Build a Transform stream that parses NDJSON. Then rewrite with `for await...of`. Compare throughput. | Lab + throughput numbers |
| V8 memory model | Learn the heap layout: new space (scavenger, semi-space copying) vs old space (mark-sweep-compact). Understand `--max-old-space-size` and what happens in a Fargate container when it's unset. | Notes + a diagram |
| Finding a leak | Deliberately build one: a module-level `Map` keyed by request ID holding a closure over a large buffer. Take heap snapshots before/after load, diff them in Chrome DevTools, find the retainer path. | Screenshot + written retainer analysis |
| GC and latency | Run with `--trace-gc`. Correlate major GC events against the p99 from your blocking-the-loop benchmark. | "GC pauses cost us X ms at p99" |
| **Build:** streaming server | Extend the raw server to stream a 1 GB file with correct backpressure. Cap RSS under 150 MB while serving 20 concurrent downloads. | Lab + memory proof |
| **Write-up** | "Backpressure: the bug you don't see until production" | Post or private note |

#### Group C — Measurement discipline

This is the group that changes how you think. Most engineers never do it.

| Unit | What to do | Deliverable |
|---|---|---|
| Why averages lie | Learn percentiles properly, and learn **coordinated omission** (Gil Tene's critique — most load tools under-report latency because they wait for the previous response before sending the next). Understand open-loop vs closed-loop load models. | Written explanation you could defend in an interview |
| Load-testing tools | `autocannon` for quick Node work, `wrk`/`k6` for serious tests. Run the same target with both. Explain any discrepancy. | Comparison note |
| CPU profiling | `node --cpu-prof`, load the `.cpuprofile` into Chrome DevTools. Learn to read a flame graph: width = time, stack depth = call depth. Find a hot function in your own code. | Annotated flame graph |
| Better tooling | `0x` for flame graphs, `clinic doctor` for a first-pass diagnosis, `clinic flame`, `clinic bubbleprof` for async flow. | Comparison of what each tool tells you |
| Profile your real system | Run your **vehicle autosearch API** locally against seeded data. Profile it. Identify the top 3 hot paths. Predict which is slowest *before* looking. | List of 3 hotspots + whether your prediction was right |
| **Build:** benchmark harness | A reusable script in `lab/` that takes a target URL + concurrency, runs a warm-up, then a measured run, and emits p50/p90/p99/p99.9 + RPS + error rate to CSV. You will use this for years. | `lab/bench/` |
| **Write-up** | "How to actually measure a Node service" | Post |

#### Group D — HTTP and the network edge

| Unit | What to do | Deliverable |
|---|---|---|
| Connection reuse | `http.Agent`, `keepAlive`, `maxSockets`, `maxFreeSockets`. Benchmark 1,000 outbound requests with keep-alive on vs off. The difference will surprise you. | Numbers |
| **Every timeout in the stack** | `server.headersTimeout`, `server.requestTimeout`, `server.keepAliveTimeout`, socket timeout, client-side timeout. Then learn the classic production bug: **when Node's `keepAliveTimeout` is shorter than the ALB idle timeout, the ALB reuses a socket Node just closed and the client gets a 502.** You work with ALBs — check your services' settings. | Written table of every timeout, its default, and its failure symptom |
| TLS | Handshake steps, cost of a full handshake vs session resumption, why connection churn is expensive, where termination happens in your architecture (ALB). | Notes + a `openssl s_client` session |
| HTTP/2 and /3 | Multiplexing, why HTTP/2 still suffers TCP head-of-line blocking, what QUIC changes. | Notes |
| Retries done right | Read the **Amazon Builders' Library** articles on timeouts/retries/backoff and on avoiding overload. Learn: exponential backoff **with full jitter**, retry budgets, why naive retries cause metastable failure (retry storms). | Written summary of the failure mode |
| **Build:** resilient HTTP client | Wrap `undici`/`fetch` with: per-attempt timeout, overall deadline, retry with full jitter, a circuit breaker, and metrics. Then break it — make the upstream return 500s at 50% and prove your breaker opens. | `lab/027-resilient-client/` |
| **Write-up** | "Timeouts, retries, and how they take down systems" | Post |

---

### 3.2 Group E — Linux, containers, and the kernel underneath

Each unit below has the same shape: study, then hands-on practice, then a build. Same session structure as §2; only the topic changes.

**Processes, file descriptors, and epoll**
Study: what a process actually is, fds, `/proc/<pid>/fd`, `ulimit -n`, blocking vs non-blocking I/O, `select`/`poll`/`epoll` and why epoll scales. Practice: `strace -c` a Node process and count syscalls; exhaust the fd limit deliberately and observe `EMFILE`. Build: a tiny epoll-style event loop in C or Go to feel it (200 lines is enough).

**Memory, CPU scheduling, and cgroups**
Study: virtual memory, RSS vs VSZ vs working set, page cache, the OOM killer. Then cgroups v2: CPU quota/period, memory limits. Practice: run Node in Docker with `--cpus=0.5` and observe throttling in `/sys/fs/cgroup/cpu.stat`; set `--memory=256m` and watch the OOM kill. **Directly relevant to you:** ECS Fargate task CPU is a cgroup quota — a 0.25 vCPU task gets throttled every 100 ms period, which shows up as mysterious p99 latency spikes, *not* as high CPU utilization. Verify this on a real task.

**Networking hands-on**
Study: TCP three-way handshake, congestion control basics, `TIME_WAIT`, SYN backlog, MTU, Nagle vs delayed ACK. Practice: `tcpdump` an actual request from your service and read the packets; `ss -tan` to inspect socket states; simulate 200 ms latency and 2% packet loss with `tc netem` and re-run your benchmark harness. Build: measure how your app behaves at 200 ms RTT — most apps that are chatty collapse.

**Containers and your deployment path**
Study: namespaces + cgroups + union filesystems = containers. Docker layer caching, multi-stage builds, image size, `PID 1` and signal handling (**your Node process must handle `SIGTERM` or ECS will `SIGKILL` it after the stop timeout and drop in-flight requests** — check this in your services). Practice: cut one of your images' size by 60%; add graceful shutdown that drains the server, closes DB/Redis pools, and exits. Build: a correct production Dockerfile for a Node service, with graceful shutdown proven by a test that kills the container mid-request.

---

### 3.3 Group F — Observability and performance engineering

**The three pillars, properly**
Metrics (counters/gauges/histograms; why histograms not averages), logs (structured JSON — you already do `process.stdout.write` for clean Fargate logs, good), traces (spans, context propagation). Learn **OpenTelemetry** properly — this is now the industry standard and knowing it well is a genuine differentiator. Instrument one of your services with OTel end to end.

**Making a system observable before it breaks**
RED metrics (Rate, Errors, Duration) for services; USE (Utilization, Saturation, Errors) for resources. Build a dashboard for your autosearch service showing: RPS, error rate, p50/p99 latency broken down by layer (OpenSearch vs Redis vs DocumentDB), cache hit rate, event loop lag. **Event loop lag is the single most under-used Node metric — export it.**

**SLOs and error budgets**
Read the Google SRE book chapters on SLOs and on eliminating toil. Define a real SLO for your autosearch endpoint (e.g. "99.5% of requests < 300 ms over 28 days"). Compute what error budget that gives you in minutes/month. Propose it at work.

**Performance case study on your own system**
Take the autosearch system end to end. Load test it. Find its ceiling. Answer in writing: What breaks first — OpenSearch, Redis, DocumentDB, or Node? At what RPS? What's the p99 contribution of each layer? What's the cache hit rate and what happens at a cold cache? What happens if Redis disappears entirely? This single document is a portfolio piece and probably the most valuable thing you produce in Stage 1.

---

## 4. Stage 2 — Data

**Goal:** be the person on the team who can look at a query and a schema and predict the plan before running it.

**Why this matters disproportionately for you:** you work with DocumentDB, Redis and OpenSearch — but almost no relational depth. That's a real gap, because relational systems are where the deepest, most transferable data ideas live (transactions, isolation, query planning, MVCC). Learn Postgres properly and DocumentDB gets easier, not harder.

### Group A — PostgreSQL, deeply

Primary text: **"PostgreSQL 14 Internals" by Egor Rogov** (free PDF, genuinely excellent) alongside the official docs.

| Unit | Practice (all in `lab/`) |
|---|---|
| Storage: pages, tuples, TOAST, the visibility map. **MVCC**: how Postgres never updates in place, what a dead tuple is, bloat, `VACUUM` and autovacuum, transaction ID wraparound | Load 10M rows. Inspect page layout with `pageinspect`. Create bloat deliberately with mass updates, watch table size grow, then `VACUUM FULL` |
| **Indexes**: B-tree structure, composite index column *order* (the left-most prefix rule), covering indexes + index-only scans, partial indexes, expression indexes, GIN/GiST/BRIN and when each wins | Build 8 index variants on the same table. Predict which the planner picks for 10 queries **before** running `EXPLAIN`. Score yourself. Repeat until you're at 9/10 |
| **Query planning**: `EXPLAIN (ANALYZE, BUFFERS)` — reading it properly. Seq scan vs index scan vs bitmap heap scan. Nested loop vs hash join vs merge join. Statistics, `n_distinct`, why the planner mis-estimates. `pg_stat_statements` | Take 10 slow queries, diagnose from the plan alone, fix, measure. Write up 3 of them |
| **Transactions**: the four isolation levels and the anomalies each permits (dirty read, non-repeatable read, phantom, write skew). Postgres's Serializable Snapshot Isolation. Lock modes, deadlocks, `SELECT ... FOR UPDATE`, `SKIP LOCKED`, advisory locks | Reproduce **write skew** with two concurrent transactions at Read Committed, then show Serializable rejecting it. This exercise alone puts you ahead of most seniors |

### Group B — Caching, Redis, and document stores

| Unit | Practice |
|---|---|
| **Redis internals**: single-threaded command execution, the RESP protocol, why pipelining is transformative, Lua scripts as the atomicity primitive, expiration (lazy + active sampling — note it's *probabilistic*, keys can outlive their TTL), the eviction policies and exactly what `allkeys-lru` vs `volatile-lru` does when memory fills | Write a raw RESP client over `net` (~150 lines). Benchmark 10k `GET`s: sequential vs pipelined. The gap is usually 10–50x |
| **Caching patterns**: cache-aside vs read-through vs write-through vs write-behind. **Cache stampede** (thundering herd) and its three fixes: probabilistic early expiration, request coalescing/single-flight, and locking. Negative caching. TTL jitter. Cache invalidation strategies and why they're hard | Build a cache layer with single-flight coalescing. Prove the stampede exists first (1,000 concurrent misses → 1,000 DB hits), then prove your fix reduces it to 1. **This maps directly onto your autosearch Redis layer** |
| **Document stores & DocumentDB specifically**: document modeling (embed vs reference), the 16 MB document limit, array indexing, compound index behavior, aggregation pipeline stages and which ones can use indexes. **Critical:** DocumentDB is API-*compatible* with MongoDB but is a different engine — it does not support every operator or stage, its index behavior differs, and Change Streams have different semantics. Read the AWS "unsupported operations" page carefully | Re-examine your `user_message_status` collection: is the compound key ordered optimally for your actual query pattern? Prove it with `explain()`. Test what your upserts do under write contention |
| **Data modeling from access patterns**: model the query, not the entity. Denormalization tradeoffs. Single-table design in DynamoDB (worth learning even if you don't use it — it teaches access-pattern-first thinking). Idempotent writes | Take a real feature at work; write down every access pattern first, *then* design the schema. Compare to what's actually in production |

### Group C — Search, migrations, and the data layer as a system

| Unit | Practice |
|---|---|
| **Search internals**: inverted indexes, postings lists, term dictionaries. Analyzers = character filters → tokenizer → token filters. **BM25** relevance scoring — actually understand the formula (term frequency saturation, inverse document frequency, field-length normalization) | For your vehicle autosearch: compare **edge-ngram** vs **completion suggester** vs **search-as-you-type** on index size, latency, and result quality. You already use edge-ngram — now prove it was the right call, or discover it wasn't |
| **OpenSearch operations**: shard sizing and the cost of over-sharding, refresh interval vs indexing throughput, the near-real-time gap, mapping explosion, reindexing with aliases for zero-downtime mapping changes, relevance tuning and boosting | Reindex behind an alias with zero downtime. Tune relevance for 20 real query examples and measure it (precision@5) |
| **Schema migrations at scale**: the expand/contract (parallel change) pattern, backfills that don't lock, online DDL, dual writes, and how to roll back a migration that's already half-applied | Write a runbook for a zero-downtime column/field addition + backfill + cutover for 50M rows. Then actually execute it against test data |
| **Consolidation**: put the whole data layer together | **Deliverable:** a written architecture review of your autosearch system's data layer — every store, why it exists, what its consistency guarantee is, what happens when each one fails, and what its scaling limit is |

**Stage 2 gate test (do this honestly):** Given a table definition, a set of indexes, and a query, can you write down the query plan on paper and be right 8 times out of 10? If not, go back to the indexing and query-planning units and stay there. Don't move on.

---

## 5. Stage 3 — Distributed Systems and Reliability

**Goal:** stop thinking "the call succeeded or failed" and start thinking "the call succeeded, failed, or is in an unknown state — and the unknown state is the common case."

Primary texts: **"Designing Data-Intensive Applications" (Kleppmann)** — read it properly, one chapter at a time, with notes — and **"Release It!" (Nygard)** for the patterns.

### Group A — The fundamentals of partial failure

| Unit | Practice |
|---|---|
| **The eight fallacies of distributed computing.** Failure modes: crash-stop, crash-recovery, omission, Byzantine. Why "the network is reliable" is the most expensive assumption in software. The **two generals problem** and why exactly-once delivery is impossible (but exactly-once *processing* is achievable) | Write out, for one real service call in your system, all five possible outcomes including the ambiguous ones |
| **Idempotency**: idempotency keys, natural idempotency, dedup windows, at-least-once + idempotent consumer = effectively-once. **The outbox pattern** for atomically updating a DB and publishing an event | Build an idempotent payment-style endpoint with an idempotency-key table and correct concurrent-request behavior (second concurrent request with same key must wait or 409, not double-charge) |
| **Consistency models**: linearizability, sequential, causal, eventual. Read-your-writes, monotonic reads. **CAP** (and why it's over-quoted) and **PACELC** (which is more useful). Replication lag and reading from replicas | Demonstrate a stale-read bug: write to primary, read from a lagging replica, show a user seeing their own write disappear. Then fix it three different ways |
| **Time and ordering**: why wall clocks lie, clock skew, NTP, monotonic clocks, **Lamport clocks and vector clocks**, why `updated_at` is a bad conflict resolver, last-write-wins data loss | Implement vector clocks; construct a concrete scenario where LWW silently loses a write |

### Group B — Messaging, queues, and event-driven systems

| Unit | Practice |
|---|---|
| **Queue semantics deeply**: at-most-once vs at-least-once vs effectively-once. SQS specifics you already use: **visibility timeout** (and what happens when processing exceeds it — duplicate delivery), long polling, DLQs, redrive, FIFO queues and message group IDs as the ordering unit, and the fact that standard SQS ordering is *not* guaranteed | Build a consumer that deliberately exceeds visibility timeout; observe the duplicate; make the consumer idempotent; prove the duplicate is now harmless |
| **Log-based messaging (Kafka)**: partitions as the unit of parallelism and ordering, offsets, consumer groups, rebalancing and its pain, retention, compaction, why a log is fundamentally different from a queue | Run Kafka locally; build a producer/consumer; force a rebalance mid-processing and observe duplicate processing |
| **Event-driven architecture**: event notification vs event-carried state transfer vs event sourcing. **CQRS** and when it's actually worth it (rarely). Saga pattern for distributed transactions, orchestration vs choreography — **you already use Step Functions, which is orchestration; write down why that choice beats choreography for your use case, and where it wouldn't** | Implement a 3-step saga with compensating transactions; kill the process between steps 2 and 3; prove it recovers correctly |
| **Backpressure and load shedding across services**: queue depth as a signal, bounded queues everywhere, why unbounded queues just move the failure, admission control, priority shedding, **metastable failures** (systems that stay broken after the trigger is removed) | Build a service that sheds load gracefully under overload instead of collapsing. Prove it: at 3x capacity it should serve 100% of the traffic it accepts and reject the rest fast, not time out everything |

### Group C — Reliability engineering and the hard build

| Unit | Practice |
|---|---|
| **Stability patterns** (Nygard): circuit breaker, bulkhead, timeout, fail fast, steady state, governor. Anti-patterns: integration points, chain reactions, cascading failure, unbounded result sets, blocked threads | Audit your production services against every pattern. Write the gap list. Fix one |
| **Consensus**: read the **Raft paper** (it's readable — that was the point of it). Leader election, log replication, safety, membership changes. Understand *why* quorum = majority | Watch the Raft visualization, then implement leader election yourself |
| **Build: a replicated key-value store** (the big one) | Single node with a write-ahead log and crash recovery → 3-node cluster with Raft leader election and log replication → kill the leader mid-write and prove no committed write is lost. This is the hardest thing in the plan. It will take far longer than you estimate. That's fine — it's worth every hour |

**Also throughout Stage 3:** work through this paper list in parallel with the units, one at a time, writing a one-page summary of each: Amazon Dynamo · Google Bigtable · MapReduce · The Chubby lock service · Raft · Kafka (LinkedIn) · Spanner · "End-to-End Arguments in System Design" · Google Borg. Papers feel intimidating for about three papers, then they don't. Reading papers comfortably is a genuine top-1% marker.

---

## 6. Stage 4 — Architecture, Security, and a Second Language

### Group A — Architecture and domain modeling

| Unit | Practice |
|---|---|
| **Modular monolith vs microservices**, honestly. The real costs of distribution (network, deployment coupling, data consistency, debugging, on-call). When services are justified (independent scaling, team autonomy at scale, isolation). Conway's Law | Write an honest evaluation of your current architecture: what should be one service that's three, and vice versa |
| **Domain-driven design, the useful 20%**: bounded contexts, ubiquitous language, aggregates as consistency/transaction boundaries, anti-corruption layers. Skip the heavy tactical patterns | Map your product's bounded contexts. Find where a leaky model is causing bugs — there will be one |
| **API design**: resource modeling, pagination that survives inserts (cursor, not offset), versioning strategies, partial responses, idempotency keys on POST, error model design, `Retry-After`, rate-limit headers. REST vs gRPC vs GraphQL and the real tradeoffs. OpenAPI as a contract, and contract testing | Write an OpenAPI spec for an existing service of yours; find three design flaws in the API you already shipped |
| **Design documents** — the highest-leverage skill in this whole document | Write a real RFC for something at work: context, goals, **non-goals**, constraints, 3 options with tradeoffs, decision + rationale, risks, rollout plan, rollback plan. Circulate it. Get it torn apart. Rewrite it |

### Group B — Security

| Unit | Practice |
|---|---|
| **AuthN vs AuthZ**: sessions vs tokens, OAuth 2.0 flows (authorization code + PKCE), OIDC, **JWT pitfalls** (`alg: none`, key confusion, no revocation, storing them wrong, why you're often better off with sessions — you already use `express-session` + Redis, so know exactly why that's frequently the right call) | Implement OAuth2 authorization code + PKCE from scratch against a real provider |
| **Authorization models**: RBAC, ABAC, ReBAC (Google Zanzibar model). **Multi-tenant isolation** — the highest-consequence class of bug in SaaS: every query must be tenant-scoped, and "we always remember to add the WHERE clause" is not a strategy | Design and implement tenant isolation that's enforced at the data-access layer, not by developer discipline |
| **The OWASP Top 10 hands-on**: injection (SQL *and* NoSQL — MongoDB operator injection via unsanitized `$` operators is a real and common bug), SSRF, IDOR, XXE, deserialization, mass assignment. Secrets management, key rotation, encryption at rest/in transit | Run OWASP Juice Shop and exploit each vulnerability yourself. Then audit your own codebase for each class |
| **Supply chain & operational security**: `npm audit` and its limits, lockfile integrity, typosquatting, postinstall scripts, dependency pinning, SBOMs, least-privilege IAM (your Lambda and ECS task roles are almost certainly over-permissioned — check) | Tighten one IAM role to true least privilege and document the process |

### Group C — A second language, and system design

**Learn Go.** Not because Node is bad, but because:
- It forces you to think about **concurrency explicitly** (goroutines, channels, `context` for cancellation, `sync` primitives, race detector) — Node's single-threaded model hides this from you entirely.
- It's the language of the infrastructure you use (Docker, Kubernetes, Terraform, Prometheus). Reading their source becomes possible.
- Static typing and explicit error handling change how you think about failure.
- It's the standard answer when Node is genuinely the wrong tool (CPU-bound work, high-concurrency proxies).

- **Foundations.** Go tour + syntax + `go test`. Rewrite two `lab/` projects in Go.
- **Concurrency.** Goroutines, channels, `select`, `context` cancellation, `sync.Mutex`/`WaitGroup`, the race detector. Build a worker pool with graceful shutdown.
- **Head-to-head.** Rewrite your raw HTTP server (project 1) in Go. Benchmark against the Node version at high concurrency. Explain the difference in terms of the two concurrency models.
- **System design practice.** Work through these one at a time, each timed at 45 min, written out and then critiqued: URL shortener · rate limiter · news feed · chat system · ride matching · distributed job scheduler · metrics ingestion pipeline · **your own autosearch system** (design it from scratch as if you'd never built it — then compare).

---

## 7. Stage 5 — Depth, Scale, and Influence

Stages 1–4 make you a strong senior. This one is what actually separates. The session structure stays the same; the *shape* of the work changes — less consuming, more producing. These arcs are roughly ordered but overlap freely.

| Arc | What it looks like |
|---|---|
| **The capstone** (§8.2) | One serious system, built to a real SLO, load tested, fully instrumented, with runbooks. Long blocks, sustained |
| **Cost engineering** | The most under-served senior skill. Learn to price a system: cost per request, per tenant, per GB. Audit your AWS bill line by line. NAT Gateway data charges, DocumentDB I/O costs, cross-AZ traffic, OpenSearch storage tiers, Fargate right-sizing. Produce a proposal that saves real money — this gets noticed at every company, immediately |
| **Depth pick: choose one and go deep** | Options: (a) database internals — build an LSM-tree storage engine; (b) compilers/V8 internals; (c) Kubernetes and the scheduler; (d) streaming systems (Flink/Kafka Streams semantics, watermarks, exactly-once); (e) ML infrastructure serving. Pick what your industry needs |
| **Open source, seriously** | Not doc typos. Pick one dependency you use in production (`ioredis`, `undici`, `pino`, `fastify`, the Mongo driver, OpenTelemetry-JS). Read its source until you understand its architecture. Fix real issues. Aim for 3+ merged non-trivial PRs. This is the single most credible external proof of skill |
| **Teaching and influence** | Run an internal tech talk series. Mentor a junior formally. Write 4 substantial public posts. Do a conference CFP — even a local meetup |
| **Reassessment** | Re-score all 8 axes. Compare to your very first scoring. Decide what comes next. By this point you should be operating at or above senior level; if your title and comp don't reflect it, that's a job-market problem, not a skill problem — act accordingly |

---

## 8. The project ladder

Projects are where learning becomes skill. Each one is deliberately chosen to force a specific realization.

### 8.1 The seven

| # | Project | The realization it forces | Where it sits |
|---|---|---|---|
| **1** | **Raw HTTP server** on `net` — parse requests, keep-alive, streaming, backpressure | Frameworks are thin. You could write Express | Stage 1, group A–B |
| **2** | **Benchmark harness** — warm-up, measured run, percentiles, CSV out | You can't improve what you don't measure, and most measurements are wrong | Stage 1, group C |
| **3** | **Resilient HTTP client** — deadlines, jittered retries, circuit breaker, metrics | Every network call is a distributed system in miniature | Stage 1, group D |
| **4** | **Distributed rate limiter** — token bucket + sliding window log, implemented in Redis **Lua** for atomicity, with a local-cache fast path | Atomicity across processes is a real problem with real solutions | Stage 2, group B |
| **5** | **Job queue on Postgres** — `SELECT ... FOR UPDATE SKIP LOCKED`, visibility timeout, retries with backoff, DLQ, priority, exactly-once *processing* via idempotency keys | You now understand what SQS actually does, because you built it | Stage 3, groups A–B |
| **6** | **Replicated KV store** — WAL + crash recovery → 3-node Raft cluster | Consensus stops being a word and becomes a mechanism | Stage 3, group C |
| **7** | **Rebuild your autosearch from scratch**, first-principles, with everything you now know | Measures your growth against a fixed reference point | End of Stage 4 |

### 8.2 The capstone (Stage 5)

**Build a multi-tenant, high-throughput event ingestion and query system.**

Requirements, all of which must be *proven*, not claimed:

- Ingest 10,000 events/sec sustained on modest hardware
- Multi-tenant with hard isolation and per-tenant rate limits and quotas
- At-least-once ingestion with effectively-once processing (idempotency)
- Sub-100 ms p99 on the query path, backed by a real load test
- Full OpenTelemetry instrumentation: metrics, logs, distributed traces
- A published SLO with an error budget, and dashboards that show budget burn
- Graceful degradation: prove behavior when the cache dies, when the DB is slow, when a dependency times out, when the process is SIGKILLed mid-write
- Chaos testing: kill components at random during a load test; the SLO must hold
- Infrastructure as code, one-command deploy, blue-green with automated rollback
- **A runbook and an architecture decision record for every significant choice**

Write it up publicly. This one artifact is worth more than any certification, and it's the thing that makes a hiring manager at a top company skip straight to the offer conversation.

---

## 9. Reading list, sequenced

Do not read these in parallel. One book at a time, one chapter at a time, with written notes. A book you took notes on is worth ten you skimmed.

**Tier 1 — read these, in this order (Stages 1–4)**

1. **Node.js Design Patterns** (Casciaro) — the streams and async chapters especially. Stage 1, groups A–B
2. **Systems Performance** (Brendan Gregg) — reference-read the Linux, CPU, memory and network chapters. Stage 1, groups E–F
3. **PostgreSQL 14 Internals** (Rogov, free PDF) — Stage 2, group A
4. **Designing Data-Intensive Applications** (Kleppmann) — the single most important book on this list. Read it across Stages 2–3, one chapter at a time
5. **Release It!** (Nygard) — stability patterns. Stage 3, group C
6. **Site Reliability Engineering** (Google, free online) — SLO and postmortem chapters. Stage 1 group F, revisited in Stage 4
7. **Fundamentals of Software Architecture** (Richards & Ford) — Stage 4, group A

**Tier 2 — Stage 5 and beyond**

- **Database Internals** (Petrov) — storage engines and distributed systems, in depth
- **Understanding Distributed Systems** (Vitillo) — a gentler complement to DDIA
- **High Performance Browser Networking** (Grigorik, free online) — best TCP/TLS/HTTP explanation anywhere
- **The Linux Programming Interface** (Kerrisk) — reference, not cover-to-cover
- **Domain-Driven Design Distilled** (Vernon) — short, sufficient
- **BPF Performance Tools** (Gregg) — if you go deep on observability
- **A Philosophy of Software Design** (Ousterhout) — short, and will change how you write code

**Free primary sources you should treat as required**

- **The Amazon Builders' Library** — timeouts/retries/backoff, avoiding overload, shuffle sharding, static stability. Written by people running the largest systems on earth. Read all of it
- **MIT 6.824 Distributed Systems** lectures (free on YouTube) — pairs perfectly with Stage 3
- The **libuv** design docs, the **V8 blog**, the **Postgres** docs (unusually good), the **Redis** docs
- **Marc Brooker's** and **Aphyr's (Jepsen)** blogs — Jepsen reports in particular teach you how databases actually behave versus their marketing

---

## 10. At-work leverage plays (specific to your stack)

Your job is the best lab you have, and it's free. These are things you could propose that are both genuinely valuable and highly visible. They don't belong to any particular stage — pick them up whenever the opportunity appears.

| Play | Why it's valuable | Why it makes you look good |
|---|---|---|
| **Export event-loop lag as a metric** on every Node service, alarm on it | It's the earliest warning of Node saturation and almost nobody instruments it | You'll catch an incident before it happens, and be able to prove it |
| **Audit `keepAliveTimeout` vs ALB idle timeout** across services | This misconfiguration causes intermittent 502s that teams chase for months | Fixing a "ghost" bug is disproportionately memorable |
| **Right-size Fargate tasks using cgroup throttle metrics**, not CPU% | 0.25/0.5 vCPU tasks get CPU-throttled in ways average CPU utilization hides completely | Directly reduces latency *and* cost |
| **Verify graceful shutdown (`SIGTERM` handling)** on every service | Without it, every deploy drops in-flight requests silently | Improves deploy-time error rates measurably |
| **Add a DLQ + redrive runbook** for every SQS consumer | Silent message loss is the worst class of bug because nobody notices | Turns an invisible risk into a visible fix |
| **Instrument the autosearch layers separately** (OpenSearch vs Redis vs DocumentDB latency) | You currently can't attribute p99 to a layer | Makes every future optimization argument data-backed |
| **Write a cost-per-request breakdown** for your top 3 services | Almost nobody at junior/mid level thinks about unit economics | Engineers who talk about cost get taken seriously by leadership immediately |
| **Volunteer for on-call and incident response** | Highest-density learning available anywhere. Nothing teaches distributed systems like being paged by one | Ownership is the single strongest senior signal |
| **Start writing design docs before you build**, even when nobody asked | Forces clarity, invites feedback early, creates a record | Design docs are how engineers gain influence beyond their own keyboard |

**One caution:** don't propose all of these at once. One at a time, finished properly, with before/after numbers. Nine well-executed improvements, delivered one after another, will change how your team sees you far more than nine simultaneous suggestions.

---

## 11. The gates

These are the only checkpoints in the plan. Do not advance until you can do every item **without notes**. Advancing because you've "spent enough time on it" while failing the criteria is exactly how people end up with a certificate and no skill — which is why there are no dates anywhere in this document, only these.

**Gate 1 — leaving Stage 1**
- [ ] Explain all six event-loop phases and correctly predict output ordering in a tricky async snippet
- [ ] Read a flame graph and identify a hot path in under 5 minutes
- [ ] Diagnose a memory leak from heap snapshot diffs
- [ ] State every timeout in a Node HTTP stack, its default, and its failure symptom
- [ ] Produce a valid p50/p95/p99 load test and explain coordinated omission
- [ ] Explain how CPU throttling works in a Fargate task
- [ ] 4+ published write-ups

**Gate 2 — leaving Stage 2**
- [ ] Predict a Postgres query plan from schema + indexes, 8/10 accuracy
- [ ] Explain all four isolation levels and demonstrate write skew
- [ ] Explain what happens in Redis when memory fills, precisely
- [ ] Design a cache with stampede protection and prove it works
- [ ] Write a zero-downtime migration runbook for 50M rows
- [ ] Complete architecture review of your own data layer

**Gate 3 — leaving Stage 3**
- [ ] Explain why exactly-once delivery is impossible and how effectively-once processing works
- [ ] Design an idempotent API and defend it under concurrent-duplicate scenarios
- [ ] Explain Raft leader election and log replication from memory
- [ ] Build a system that sheds load instead of collapsing, and prove it
- [ ] 6+ papers read and summarized
- [ ] Working replicated KV store

**Gate 4 — leaving Stage 4**
- [ ] Write an RFC that a senior engineer says is good
- [ ] Design a system end-to-end in 45 minutes, on a whiteboard, with tradeoffs stated
- [ ] Exploit and then fix each OWASP Top 10 category
- [ ] Ship something in Go
- [ ] Rebuild autosearch from first principles and articulate what changed

---

## 12. Anti-patterns — the ways this fails

| Trap | What it looks like | The fix |
|---|---|---|
| **Tutorial hell** | Hours of video, no artifacts | The 48-hour build rule (§0.4) |
| **Framework chasing** | Learning Nest, then tRPC, then Bun, then Deno | Frameworks are weekend-learnable. Fundamentals aren't. Spend your scarce hours on the slow-decaying knowledge |
| **Breadth without depth** | Can name 40 AWS services, can't explain how one works | Depth in three areas beats shallowness in thirty. Depth transfers; breadth doesn't |
| **Unmeasured optimization** | "I refactored it and it feels faster" | Number before, number after, or it didn't happen |
| **Happy-path-only knowledge** | Everything works in dev | The **Break** stage is not optional. Kill things deliberately |
| **Not writing** | Notes are bullet fragments nobody could read | 300+ words of prose, written for a reader. Fuzzy thinking cannot survive prose |
| **Avoiding hard, unglamorous work** | Ducking on-call, migrations, legacy code | This is where the real learning is, and where ownership is proven |
| **Learning in private forever** | Never publishing, never asking for review | Public work has a quality bar private work never reaches |
| **Comparing your start to someone's tenth year** | Discouragement, then quitting | Compare only to your own first self-assessment. The 8-axis scoring exists for exactly this |
| **Sprinting, then stopping** | Heroic effort for a stretch, then nothing for a long stretch | Continuity beats intensity by roughly an order of magnitude. Pick a load you could sustain indefinitely, then sustain it |

---

## 13. Career mechanics (because skill alone isn't sufficient)

Skill gets you to senior. These get you the rest of the way.

1. **Optimize for problem density, not title or comp, early on.** The fastest growth happens where the problems are genuinely hard and the engineers around you are better than you. If you're the best backend engineer on your team, that's a warning sign, not a compliment.
2. **Take the work nobody wants.** The migration, the flaky test suite, the on-call rotation, the legacy service everyone fears. It's under-contested, high-learning, and highly visible.
3. **Make your work legible.** Numbers, before/after, business impact. "Reduced p99 from 1.2s to 180ms, cutting search abandonment by X%" is a sentence that changes careers. "Optimized queries" is not.
4. **Get reviewed by the best engineer near you.** Ask them directly to tear apart one design doc a month. The discomfort is the entire point.
5. **Keep a brag document.** Update it whenever you finish something, 2 minutes. Every non-trivial thing you did, with numbers. You will not remember any of it at review time, and reconstructing it from memory always under-sells you by half.
6. **Interview periodically even when happy.** It calibrates you honestly against the market and keeps you sharp. The feedback is free information you can't get any other way.
7. **Build in public, modestly.** The `lab/` repo, the blog posts, the OSS PRs. A sustained body of this makes hiring you an obvious decision rather than a bet.

---

## 14. Where to start

Skip everything above and do exactly this, in order:

1. Install WSL2 + Ubuntu, Docker, `nvm`, and the VS Code WSL extension. (~1 hour)
2. Create the `lab/` Git repo, push it somewhere.
3. Open a note and honestly score yourself 1–5 on the eight axes in §1. Date it — this is your only baseline, and it's the one number you'll compare everything to.
4. Decide what a deep block looks like for you: where, what time, what you shut off. Make it a standing commitment rather than something you decide each time.
5. Open the first unit in §3.1 and start.

That's it. The rest is showing up repeatedly and refusing to move past a gate you haven't earned — which is both the easiest and the hardest part.

---

> **A closing note, honestly stated:** you are early in this, already working on production search infrastructure across OpenSearch, Redis, DocumentDB, SQS and Step Functions, and asking the right question. That combination is genuinely uncommon. The plan above works, but only because of the boring part — the deep block, repeated. The difference between you and the version of you who didn't do this will not be knowledge. It will be that you *measure* things, you *write* things down, and you refuse to use what you can't explain. Everything else follows from those three habits.
