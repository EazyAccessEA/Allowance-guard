# Performance Budget - Allowance Guard

**Generated:** 2024-12-19  
**Target:** Core Web Vitals + Bundle Optimization

## Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms  
- **CLS (Cumulative Layout Shift):** < 0.1
- **INP (Interaction to Next Paint):** < 200ms

### Bundle Size Budgets
- **Initial JS Bundle:** < 250KB (gzipped)
- **Total JS Bundle:** < 500KB (gzipped)
- **CSS Bundle:** < 50KB (gzipped)
- **Images:** < 100KB per image

### API Performance
- **TTFB (Time to First Byte):** < 200ms
- **API Response Time:** < 500ms (95th percentile)
- **Database Query Time:** < 100ms (95th percentile)

## Current Performance Issues

### Bundle Size Issues
1. **Large vendor chunks:** AppKit/Wagmi bundles too large
2. **Unused code:** Some components not tree-shaken
3. **Image optimization:** Not all images optimized

### Performance Wins
1. **Code splitting:** Implement route-level splitting
2. **Image optimization:** Use Next.js Image component
3. **Font optimization:** Implement font display swap
4. **Caching:** Implement proper caching strategies

## Implementation Plan

### Phase 1 (48h)
1. Implement code splitting for wallet components
2. Optimize critical images
3. Add performance monitoring

### Phase 2 (1 week)
1. Implement service worker
2. Add lazy loading for non-critical components
3. Optimize font loading

### Phase 3 (2 weeks)
1. Implement advanced caching
2. Add performance budgets to CI
3. Optimize database queries
