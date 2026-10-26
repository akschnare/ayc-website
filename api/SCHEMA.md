# Club Management API — mock contract (v0.1)
The website is a pure consumer. It never talks to Clubspot or a database directly; it calls `CLUB_API_BASE` (see js/api.js). Today that points at static JSON in /api. Later it points at the standalone club-management platform (multi-tenant; every resource carries `clubId`).

## Read (public, cacheable)
- GET /clubs/{clubId}            -> club.json  (contacts, VHF, membership categories)
- GET /clubs/{clubId}/events     -> events.json  Event[]
- GET /clubs/{clubId}/documents  -> documents.json  Document[] (visibility: public|members)

## Write (POST; mocked as console + localStorage in the prototype)
- POST /clubs/{clubId}/dockage-requests   DockageRequest
- POST /clubs/{clubId}/membership-inquiries  MembershipInquiry
- POST /clubs/{clubId}/events/{id}/registrations  Registration  (auth + payment = PLACEHOLDER)

## Shapes (TypeScript-ish)
```ts
Member { id; clubId; firstName; lastName; email; phone?; category: 'senior'|'intermediate'|'junior'|'social'|'affiliate'|'outport'; associateOf?: MemberId; status:'applicant'|'active'|'lapsed'; joinedOn?; boats: BoatId[] }
Boat { id; clubId; ownerId; name; type; loaFt; beamFt; draftFt; assignment?: { kind:'marina'|'mooring'|'dry'|'wet-winter'; slot } }
Event { id; clubId; title; start; end; category; audience:'public'|'members'; sourceUrl; registration:{ required; provider:'native'|'clubspot'|'checklick'|null; url } }
Registration { id; clubId; eventId; memberId?; guest?:{name;email}; boatId?; status:'pending'|'confirmed'|'waitlisted'|'cancelled'; paymentIntentId? }
DockageRequest { id; clubId; vesselName; loaFt; draftFt; beamFt?; arrival; departure; preference:'marina'|'mooring'|'either'; power:boolean; contact:{name;email;phone}; homePort?; notes?; status:'requested'|'confirmed'|'declined' }
MembershipInquiry { id; clubId; category; name; email; phone?; hasBoat:boolean; message? }
Document { id; clubId; title; file; category; visibility; needsReview }
```
