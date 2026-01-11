(function() {
    "use strict";

    function prefersReducedMotion() {
        try {
            return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        } catch (e) {
            return false;
        }
    }

    function parsePositiveInt(value, fallback) {
        var n = parseInt(value, 10);
        return isNaN(n) || n <= 0 ? fallback : n;
    }

    function clampIndex(index, count) {
        if (count <= 0) return 0;
        var normalized = index % count;
        return normalized < 0 ? normalized + count : normalized;
    }

    function initGallerySlider(root) {
        var mainImage = root.querySelector("[data-main]");
        var status = root.querySelector("[data-status]");
        var prevButton = root.querySelector("[data-prev]");
        var nextButton = root.querySelector("[data-next]");
        var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-thumbs] [data-index]"));

        if (!mainImage || thumbs.length === 0) return;

        var currentIndex = 0;
        var fadeToken = 0;
        var fadeDurationMs = 1000;
        var autoplayTimerId = null;
        var isPaused = false;
        var autoplayDelayMs = parsePositiveInt(root.getAttribute("data-autoplay-interval"), 5000);

        var autoplayAttr = (root.getAttribute("data-autoplay") || "").toLowerCase();
        var reducedMotion = prefersReducedMotion();
        var autoplayEnabled = !reducedMotion;

        // Allow an explicit per-gallery override.
        // - default: respects prefers-reduced-motion
        // - data-autoplay="on|true|1": enable autoplay even with reduced motion
        // - data-autoplay="off|false|0": disable autoplay
        if (autoplayAttr === "off" || autoplayAttr === "false" || autoplayAttr === "0") {
            autoplayEnabled = false;
        } else if (autoplayAttr === "on" || autoplayAttr === "true" || autoplayAttr === "1" || autoplayAttr === "force") {
            autoplayEnabled = true;
        }

        function stopAutoplay() {
            if (autoplayTimerId) {
                window.clearTimeout(autoplayTimerId);
                autoplayTimerId = null;
            }
        }

        function scheduleAutoplay() {
            stopAutoplay();
            if (!autoplayEnabled || isPaused) return;

            autoplayTimerId = window.setTimeout(function() {
                // If user has since paused or tab is hidden, do nothing.
                if (!autoplayEnabled || isPaused || document.hidden) return;
                setActiveIndex(currentIndex + 1);
                scheduleAutoplay();
            }, autoplayDelayMs);
        }

        function resetAutoplay() {
            // Keep autoplay behavior, but restart the timer after manual interaction.
            scheduleAutoplay();
        }

        function setMainImageWithFade(src) {
            if (!src) return;

            // If reduced motion is requested, do an instant swap.
            if (!mainImage || prefersReducedMotion()) {
                mainImage.src = src;
                return;
            }

            // Avoid redundant work.
            if ((mainImage.getAttribute("src") || "") === src) return;

            fadeToken += 1;
            var token = fadeToken;

            mainImage.classList.add("is-fading");

            window.setTimeout(function() {
                if (token !== fadeToken) return;

                mainImage.onload = function() {
                    if (token !== fadeToken) return;
                    mainImage.classList.remove("is-fading");
                };

                mainImage.src = src;

                // If cached and already complete, onload may not fire reliably.
                if (mainImage.complete) {
                    mainImage.classList.remove("is-fading");
                }
            }, fadeDurationMs);
        }

        function setActiveIndex(nextIndex) {
            currentIndex = clampIndex(nextIndex, thumbs.length);

            var activeThumb = thumbs[currentIndex];
            var src = activeThumb.getAttribute("data-src");
            if (src) setMainImageWithFade(src);

            for (var i = 0; i < thumbs.length; i++) {
                if (i === currentIndex) {
                    thumbs[i].setAttribute("aria-current", "true");
                } else {
                    thumbs[i].removeAttribute("aria-current");
                }
            }

            if (status) {
                status.textContent = String(currentIndex + 1) + " / " + String(thumbs.length);
            }
        }

        function findIndexFromMainSrc() {
            var currentSrc = mainImage.getAttribute("src") || "";
            for (var i = 0; i < thumbs.length; i++) {
                if (thumbs[i].getAttribute("data-src") === currentSrc) return i;
            }
            return 0;
        }

        currentIndex = findIndexFromMainSrc();
        setActiveIndex(currentIndex);

        if (prevButton) {
            prevButton.addEventListener("click", function() {
                setActiveIndex(currentIndex - 1);
                resetAutoplay();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function() {
                setActiveIndex(currentIndex + 1);
                resetAutoplay();
            });
        }

        for (var i = 0; i < thumbs.length; i++) {
            thumbs[i].addEventListener("click", function(event) {
                if (event && event.preventDefault) event.preventDefault();

                var indexValue = this.getAttribute("data-index");
                var index = parseInt(indexValue, 10);
                if (!isNaN(index)) {
                    setActiveIndex(index);
                    resetAutoplay();
                }
            });
        }

        root.addEventListener("keydown", function(event) {
            if (!event) return;

            if (event.key === "ArrowLeft") {
                setActiveIndex(currentIndex - 1);
                resetAutoplay();
                event.preventDefault();
            } else if (event.key === "ArrowRight") {
                setActiveIndex(currentIndex + 1);
                resetAutoplay();
                event.preventDefault();
            }
        });

        // Optional: pause autoplay while hovering.
        // Default is "no pause" to avoid feeling "stuck" when the mouse is over the gallery.
        var pauseMode = (root.getAttribute("data-autoplay-pause") || "").toLowerCase();
        if (pauseMode === "hover") {
            root.addEventListener("mouseenter", function() {
                isPaused = true;
                stopAutoplay();
            });

            root.addEventListener("mouseleave", function() {
                isPaused = false;
                scheduleAutoplay();
            });
        }

        // Only pause when the gallery container itself is focused.
        // (Clicking buttons/thumbs focuses those elements; we don't want autoplay to freeze.)
        root.addEventListener("focusin", function(event) {
            var target = event && event.target;
            if (target !== root) return;
            isPaused = true;
            stopAutoplay();
        });

        root.addEventListener("focusout", function(event) {
            var target = event && event.target;
            if (target !== root) return;
            isPaused = false;
            scheduleAutoplay();
        });

        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
                stopAutoplay();
            } else {
                scheduleAutoplay();
            }
        });

        scheduleAutoplay();
    }

    document.addEventListener("DOMContentLoaded", function() {
        var galleries = document.querySelectorAll("[data-gallery]");
        for (var i = 0; i < galleries.length; i++) {
            initGallerySlider(galleries[i]);
        }
    });
})();