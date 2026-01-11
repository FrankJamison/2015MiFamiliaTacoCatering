/*
    2026 refresh:
    - Removed legacy jQuery + IE-specific behaviors.
    - Kept lightweight enhancements needed by the theme:
        - menu separators
        - active-link highlighting for the vertical menu
*/

(function() {
    function asArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }

    function getCurrentPageFilename() {
        var path = window.location.pathname || '';
        var last = path.split('/').pop();
        return last || 'index.html';
    }

    function normalizeHrefToFilename(href) {
        if (!href) return '';
        // Ignore external links
        if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return '';
        return href.split('#')[0].split('?')[0].split('/').pop();
    }

    function ensureTopMenuSeparators() {
        asArray(document.querySelectorAll('ul.art-menu')).forEach(function(menu) {
            // Avoid double-inserting.
            if (menu.querySelector('.art-menu-li-separator')) return;

            var items = asArray(menu.querySelectorAll(':scope > li'));
            items.forEach(function(li, idx) {
                if (idx === items.length - 1) return;
                var sepLi = document.createElement('li');
                sepLi.className = 'art-menu-li-separator';
                var sepSpan = document.createElement('span');
                sepSpan.className = 'art-menu-separator';
                sepSpan.textContent = ' ';
                sepLi.appendChild(sepSpan);
                li.insertAdjacentElement('afterend', sepLi);
            });
        });
    }

    function ensureVMenuSeparators() {
        asArray(document.querySelectorAll('ul.art-vmenu')).forEach(function(menu) {
            // Avoid double-inserting.
            if (menu.querySelector('.art-vmenu-separator')) return;

            var items = asArray(menu.querySelectorAll(':scope > li'));
            items.forEach(function(li, idx) {
                if (idx === 0) return;
                var sepLi = document.createElement('li');
                sepLi.className = 'art-vmenu-separator';
                var sepSpan = document.createElement('span');
                sepSpan.className = 'art-vmenu-separator-span';
                sepSpan.textContent = ' ';
                sepLi.appendChild(sepSpan);
                li.insertAdjacentElement('beforebegin', sepLi);
            });
        });
    }

    function setActiveMenuLinks() {
        var current = getCurrentPageFilename();
        if (!current) return;

        // Clear existing active states first.
        asArray(document.querySelectorAll('ul.art-vmenu a.active')).forEach(function(a) {
            a.classList.remove('active');
        });

        asArray(document.querySelectorAll('ul.art-vmenu a')).forEach(function(a) {
            var hrefFile = normalizeHrefToFilename(a.getAttribute('href'));
            if (hrefFile && hrefFile.toLowerCase() === current.toLowerCase()) {
                a.classList.add('active');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        ensureTopMenuSeparators();
        ensureVMenuSeparators();
        setActiveMenuLinks();
    });
})();