# Stack Reference: Swift 6 + SwiftUI + AppKit (macOS 14–26)

> Distilled from native macOS SwiftPM production builds (Tessera Studio, CLI, Core).

## 1. Module Boundaries & Persistence Safety
- **Pure Core Target:** Keep domain models, tree algorithms, and storage in a `Foundation`-only `Core` library (never import `SwiftUI` or `AppKit`) with `Sendable`, `Equatable`, `Codable` value types so CLI binaries and headless Swift Testing suites stay fast and portable.
- **Backward-Compatible Decoding:** Always decode newly added persisted fields with `decodeIfPresent` + sensible defaults so existing `~/Library/Application Support/` JSON files never fail to load.
- **Secure Atomic Storage:** Write JSON with `.atomic`, enforce `0o600` POSIX permissions on sensitive app-support files, cap import payloads (e.g., 10 MB), and quarantine corrupt files to `.corrupt-<timestamp>.bak` before throwing.
- **Corrupt-Store Cascade Guard (`CRITICAL`):** When store B references IDs from store A (e.g., `layout.folderID` -> `folders.json`), track `storeALoadedCleanly`. Never run orphan-ID cleanup or rewrite store B when store A failed to load, or a single corrupt file will permanently wipe cross-store links.

## 2. Recursive Trees & Graph Safety (Folders, Split Panes)
- **No Unchecked `uniqueKeysWithValues`:** On disk-loaded arrays, always build lookup maps with `Dictionary(..., uniquingKeysWith: { first, _ in first })` so manually edited duplicate IDs never trap at runtime.
- **Sanitize on Load:** Run a pure `sanitizing(_:)` pass on loaded parent-child graphs to deduplicate IDs, clear dangling `parentID`s, and break cycles to root.
- **Subtree-Aware `canMove`:** Reject self-moves, descendant cycles, and moves where `newParentDepth + 1 + movingSubtreeHeight >= maxDepth`.
- **UI Recursion Guard:** Pass `visitedIDs: Set<UUID>` and a depth bound into recursive SwiftUI branch views as defense-in-depth against infinite view recursion.
- **Non-Destructive Delete:** Deleting a container folder should promote immediate children and items to the deleted folder's parent rather than destroying user data.

## 3. Native macOS 14–26 SwiftUI & AppKit Craft
- **Zero-Inset Window Chrome (macOS 26):** Avoid `NavigationSplitView` + `.toolbar` automatic double-pill clipping and empty titlebar insets by using `.windowStyle(.hiddenTitleBar)` with a full-bleed `HStack`, `.ignoresSafeArea(.container, edges: .top)`, a `62–66pt` leading traffic-light spacer, and aligned `46pt` top headers.
- **120 FPS Divider Resizing:** Anchor divider `DragGesture`s to a fixed parent `.coordinateSpace(name:)` (never `.local`, which oscillates as the divider moves), suppress animations during active drag, and debounce disk persistence (`~300ms`).
- **Gesture Latency:** Never chain `.onTapGesture(count: 2)` and `.onTapGesture(count: 1)` on the same row — SwiftUI waits for the macOS double-click timeout before firing single-tap. Keep single-tap instant on the row and scope double-click rename to the title `Text` (plus context menu).
- **Drop Targets:** Attach `.dropDestination` to folder rows, root section headers, AND empty-folder placeholder views.
- **TextKit 1 Prompt Editors:** For terminal/code inputs with a custom gutter, share an exact `NSParagraphStyle` (`lineHeightMultiple`) between gutter glyph drawing and `NSTextView` typing attributes, and inset `drawInsertionPoint` vertically so the caret stays inside active-line pills.
- **Subprocess Safety:** Always drain `stdout` and `stderr` pipes concurrently via a thread-safe locked buffer (preventing >64 KB OS pipe deadlocks) and enforce process timeouts (`SIGTERM` -> `SIGKILL`).
