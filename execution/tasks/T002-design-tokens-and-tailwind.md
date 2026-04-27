# T002 Design Tokens And Tailwind

## Objective

Encode Eclipse Glass into Tailwind/theme/global tokens and establish spacing/type rules.

## Ownership

Files:
- `tailwind.config.ts`
- `src/styles/globals.css`
- optional shared token helper files

## Dependencies

- contracts `02`, `03`

## Must Do

- map PRD color tokens into reusable theme variables
- define typography scale and font loading hooks
- constrain spacing utilities to the approved set where practical
- encode approved gradients and glow tokens

## Must Not Do

- introduce off-system colors, gradients, or spacing

## Done When

- primitives can consume named design tokens
- app surfaces render with approved palette and type

## Verification

- inspect token usage in sample primitives and shell
