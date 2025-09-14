/**
 * CSS Style Optimizer - Dynamic class application for maximum CSS reuse
 * This script applies shared utility classes to reduce CSS redundancy even further
 */

(function() {
    'use strict';
    
    // Debug mode - set to true to see console logs
    const DEBUG_MODE = true;
    
    function log(message, data) {
        if (DEBUG_MODE) {
            console.log(`[CSS Optimizer] ${message}`, data || '');
        }
    }
    
    // Apply shared classes dynamically to maximize CSS reuse
    function applySharedClasses() {
        let optimizationsApplied = 0;
        
        // Apply component base classes for buttons
        const buttons = document.querySelectorAll('.cta, .community-link');
        buttons.forEach(btn => {
            if (!btn.classList.contains('component-button')) {
                btn.classList.add('component-button');
                optimizationsApplied++;
            }
        });
        log(`Applied component-button class to ${buttons.length} buttons`);
        
        // Apply component base classes for cards
        const cards = document.querySelectorAll('.feature-card, .hardware-card');
        cards.forEach(card => {
            if (!card.classList.contains('component-card')) {
                card.classList.add('component-card');
                optimizationsApplied++;
            }
        });
        log(`Applied component-card class to ${cards.length} cards`);
        
    // Apply section base classes for layout containers
    const sections = document.querySelectorAll('.community');
        sections.forEach(section => {
            if (!section.classList.contains('section-center')) {
                section.classList.add('section-center');
                optimizationsApplied++;
            }
        });
        log(`Applied section-center class to ${sections.length} sections`);
        
    // Apply layout classes for flex containers
    const flexContainers = document.querySelectorAll('.features');
        flexContainers.forEach(container => {
            if (!container.classList.contains('section-layout')) {
                container.classList.add('section-layout');
                optimizationsApplied++;
            }
        });
        log(`Applied section-layout class to ${flexContainers.length} flex containers`);
        
        // Apply hero element class for shared hero styling
        const heroElements = document.querySelectorAll('.ufos-title, .hero-download');
        heroElements.forEach(element => {
            if (!element.classList.contains('hero-element')) {
                element.classList.add('hero-element');
                optimizationsApplied++;
            }
        });
        log(`Applied hero-element class to ${heroElements.length} hero elements`);
        
        if (optimizationsApplied > 0) {
            log(`✅ Applied ${optimizationsApplied} CSS optimizations`);
            
            // Add visual indicator that optimizer ran
            document.documentElement.setAttribute('data-css-optimized', 'true');
            document.documentElement.setAttribute('data-optimizations-applied', optimizationsApplied.toString());
        } else {
            log(`ℹ️ No new optimizations needed - all classes already applied`);
        }
        
        return optimizationsApplied;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            log('🚀 CSS Optimizer initializing...');
            applySharedClasses();
        });
    } else {
        log('🚀 CSS Optimizer initializing (DOM already ready)...');
        applySharedClasses();
    }
    
    // For SPA or dynamic content, observe changes and reapply optimizations
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldReapply = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes need class application
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node or its children match our selectors
                            const hasTargetElements = node.matches && (
                                node.matches('.cta, .community-link, .feature-card, .hardware-card, .community, .features, .ufos-title, .hero-download') ||
                                node.querySelector('.cta, .community-link, .feature-card, .hardware-card, .community, .features, .ufos-title, .hero-download')
                            );
                            
                            if (hasTargetElements) {
                                shouldReapply = true;
                                log('🔄 New elements detected, will reapply optimizations');
                            }
                        }
                    });
                }
            });
            
            if (shouldReapply) {
                // Debounce rapid changes
                clearTimeout(observer.timeout);
                observer.timeout = setTimeout(function() {
                    log('🔄 Reapplying optimizations for dynamic content...');
                    applySharedClasses();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        log('👀 MutationObserver set up for dynamic content');
    }
    
    // Export for manual triggering and testing
    window.cssOptimizer = {
        reapply: applySharedClasses,
        debug: function() {
            log('=== CSS Optimizer Debug Info ===');
            log('Optimized attribute:', document.documentElement.getAttribute('data-css-optimized'));
            log('Optimizations applied:', document.documentElement.getAttribute('data-optimizations-applied'));
            
            const stats = {
                buttons: document.querySelectorAll('.component-button').length,
                cards: document.querySelectorAll('.component-card').length,
                sections: document.querySelectorAll('.section-center').length,
                layouts: document.querySelectorAll('.section-layout').length,
                heroes: document.querySelectorAll('.hero-element').length
            };
            
            log('Current optimized elements:', stats);
            return stats;
        },
        test: function() {
            log('🧪 Running CSS Optimizer test...');
            const beforeStats = this.debug();
            const optimizations = applySharedClasses();
            const afterStats = this.debug();
            
            log('✅ Test complete!', {
                before: beforeStats,
                after: afterStats,
                newOptimizations: optimizations
            });
            
            return { before: beforeStats, after: afterStats, newOptimizations: optimizations };
        }
    };
    
    log('🎯 CSS Optimizer loaded successfully! Use cssOptimizer.debug() or cssOptimizer.test() in console for testing.');
})();
