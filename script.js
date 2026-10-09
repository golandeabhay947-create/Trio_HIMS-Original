/* =========================================================
   TRIO HIMS - MAIN JAVASCRIPT
   Compatible with existing TRIO HIMS HTML
   ========================================================= */

(function () {

  "use strict";


  /* =========================================================
     HELPER FUNCTIONS
     ========================================================= */

  function $(selector, parent) {
    try {
      var root =
        (parent && typeof parent.querySelector === "function")
          ? parent
          : document;
      return root.querySelector(selector);
    } catch (e) {
      return null;
    }
  }

  function $$(selector, parent) {
    try {
      var root =
        (parent && typeof parent.querySelectorAll === "function")
          ? parent
          : document;
      return Array.prototype.slice.call(
        root.querySelectorAll(selector)
      );
    } catch (e) {
      return [];
    }
  }

  function addEvent(element, event, callback, options) {
    if (!element) return;

    element.addEventListener(
      event,
      callback,
      options || false
    );
  }


  /* =========================================================
     DOM READY
     ========================================================= */

  addEvent(
    document,
    "DOMContentLoaded",
    function () {


      /* =====================================================
         HEADER
         ===================================================== */

      var header = $("#header");

      function headerScroll() {

        if (!header) return;

        if (window.scrollY > 50) {
          header.classList.add(
            "header-scrolled"
          );
        } else {
          header.classList.remove(
            "header-scrolled"
          );
        }
      }

      addEvent(
        window,
        "scroll",
        headerScroll,
        { passive: true }
      );

      headerScroll();


      /* =====================================================
         MOBILE NAVIGATION
         ===================================================== */

      var mobileToggle =
        $(".mobile-nav-toggle");

      var navbar =
        $("#navbar");

      if (
        mobileToggle &&
        navbar
      ) {

        addEvent(
          mobileToggle,
          "click",
          function () {

            navbar.classList.toggle(
              "navbar-mobile"
            );

            mobileToggle.classList.toggle(
              "bi-list"
            );

            mobileToggle.classList.toggle(
              "bi-x"
            );

          }
        );
      }


      /* =====================================================
         MOBILE DROPDOWNS
         ===================================================== */

      $$(".navbar .dropdown > a").forEach(
        function (link) {

          addEvent(
            link,
            "click",
            function (event) {

              if (
                navbar &&
                navbar.classList.contains(
                  "navbar-mobile"
                )
              ) {

                event.preventDefault();

                var parent =
                  link.parentElement;

                if (parent) {
                  parent.classList.toggle(
                    "active"
                  );
                }
              }
            }
          );

        }
      );


      /* =====================================================
         CLOSE MOBILE NAVIGATION
         ===================================================== */

      $$("#navbar a").forEach(
        function (link) {

          addEvent(
            link,
            "click",
            function () {

              if (
                !navbar ||
                !navbar.classList.contains(
                  "navbar-mobile"
                )
              ) {
                return;
              }

              var parent =
                link.parentElement;

              if (
                parent &&
                parent.classList.contains(
                  "dropdown"
                )
              ) {
                return;
              }

              navbar.classList.remove(
                "navbar-mobile"
              );

              if (mobileToggle) {

                mobileToggle.classList.remove(
                  "bi-x"
                );

                mobileToggle.classList.add(
                  "bi-list"
                );
              }

            }
          );

        }
      );


      /* =====================================================
         SMOOTH SCROLL
         ===================================================== */

      $$(
        'a[href^="#"]:not([href="#"])'
      ).forEach(
        function (link) {

          addEvent(
            link,
            "click",
            function (event) {

              var href =
                link.getAttribute(
                  "href"
                );

              if (
                !href ||
                href === "#" ||
                href.length < 2
              ) {
                return;
              }

              /*
               * Only process IDs.
               */
              if (
                href.charAt(0) !== "#"
              ) {
                return;
              }

              var target =
                document.getElementById(
                  href.substring(1)
                );

              if (!target) {
                return;
              }

              event.preventDefault();

              var headerHeight =
                header
                  ? header.offsetHeight
                  : 0;

              var targetPosition =
                target.getBoundingClientRect()
                  .top +
                window.pageYOffset -
                headerHeight -
                15;

              window.scrollTo({
                top:
                  targetPosition,
                behavior:
                  "smooth"
              });

            }
          );

        }
      );


      /* =====================================================
         ACTIVE NAVIGATION
         ===================================================== */

      var navLinks =
        $$("#navbar .nav-link");

      var pageSections =
        $$("section[id]");

      function updateNavigation() {

        var scrollPosition =
          window.pageYOffset + 180;

        var currentSection =
          "";

        pageSections.forEach(
          function (section) {

            var top =
              section.offsetTop;

            var height =
              section.offsetHeight;

            if (
              scrollPosition >= top &&
              scrollPosition <=
                top + height
            ) {

              currentSection =
                section.id;
            }

          }
        );

        navLinks.forEach(
          function (link) {

            link.classList.remove(
              "active"
            );

            var href =
              link.getAttribute(
                "href"
              );

            if (
              href ===
              "#" + currentSection
            ) {

              link.classList.add(
                "active"
              );
            }

          }
        );
      }

      addEvent(
        window,
        "scroll",
        updateNavigation,
        { passive: true }
      );


      /* =====================================================
         BACK TO TOP
         ===================================================== */

      var backToTop =
        $(".back-to-top");

      function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 300) {

          backToTop.classList.add(
            "active"
          );

        } else {

          backToTop.classList.remove(
            "active"
          );
        }
      }

      addEvent(
        window,
        "scroll",
        updateBackToTop,
        { passive: true }
      );

      updateBackToTop();


      /* =====================================================
         REVEAL ANIMATIONS
         ===================================================== */

      var revealElements =
        $$(
          ".reveal-up, " +
          ".reveal-fade, " +
          ".reveal-left, " +
          ".reveal-right"
        );

      revealElements.forEach(
        function (element) {

          element.classList.add(
            "visible"
          );

          element.classList.add(
            "revealed"
          );

        }
      );

      if (
        "IntersectionObserver" in window
      ) {

        var revealObserver =
          new IntersectionObserver(
            function (entries) {

              entries.forEach(
                function (entry) {

                  if (
                    entry.isIntersecting
                  ) {

                    entry.target.classList.add(
                      "visible"
                    );

                    entry.target.classList.add(
                      "revealed"
                    );

                    revealObserver.unobserve(
                      entry.target
                    );

                  }

                }
              );

            },
            {
              threshold: 0.05
            }
          );

        revealElements.forEach(
          function (element) {

            revealObserver.observe(
              element
            );

          }
        );

      }


      /* =====================================================
         DASHBOARD TABS
         ===================================================== */

      var dashboardTabs =
        $$(".dash-tab");

      var dashboardPanels =
        $$(".dashboard-panel");

      dashboardTabs.forEach(
        function (tab) {

          addEvent(
            tab,
            "click",
            function () {

              dashboardTabs.forEach(
                function (item) {

                  item.classList.remove(
                    "active"
                  );

                  item.setAttribute(
                    "aria-selected",
                    "false"
                  );

                }
              );

              dashboardPanels.forEach(
                function (panel) {

                  panel.classList.remove(
                    "active"
                  );

                }
              );

              tab.classList.add(
                "active"
              );

              tab.setAttribute(
                "aria-selected",
                "true"
              );

              var target =
                tab.getAttribute(
                  "data-target"
                ) || "";

              if (
                target.charAt(0) === "#"
              ) {
                target =
                  target.substring(1);
              }

              var panel =
                document.getElementById(
                  target
                ) ||
                document.getElementById(
                  "dash-" + target
                );

              if (panel) {

                panel.classList.add(
                  "active"
                );

              }

            }
          );

        }
      );


      /* Dashboard live date display */
      var dashboardDateEl =
        $("#dashboard-date") ||
        $("#dashboardDate");

      if (dashboardDateEl) {

        dashboardDateEl.textContent =
          new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          );

      }


      /* =====================================================
         PATIENT JOURNEY
         ===================================================== */

      var journeySteps =
        $$(".journey-step");

      var journeyPanels =
        $$(".journey-panel");

      journeySteps.forEach(
        function (step) {

          addEvent(
            step,
            "click",
            function () {

              var stepName =
                step.getAttribute(
                  "data-panel"
                ) ||
                step.getAttribute(
                  "data-step"
                );

              if (!stepName) {
                return;
              }

              journeySteps.forEach(
                function (item) {

                  item.classList.remove(
                    "active"
                  );

                  item.setAttribute(
                    "aria-selected",
                    "false"
                  );

                }
              );

              journeyPanels.forEach(
                function (panel) {

                  panel.classList.remove(
                    "active"
                  );

                }
              );

              step.classList.add(
                "active"
              );

              step.setAttribute(
                "aria-selected",
                "true"
              );

              var target =
                document.getElementById(
                  "panel-" +
                  stepName
                ) ||
                document.getElementById(
                  stepName
                );

              if (target) {

                target.classList.add(
                  "active"
                );

              }

            }
          );


          /*
           * Keyboard support
           */

          if (
            !step.hasAttribute(
              "tabindex"
            )
          ) {

            step.setAttribute(
              "tabindex",
              "0"
            );
          }

          addEvent(
            step,
            "keydown",
            function (event) {

              if (
                event.key ===
                  "Enter" ||
                event.key ===
                  " "
              ) {

                event.preventDefault();

                step.click();

              }

            }
          );

        }
      );


      /* =====================================================
         ROLE EXPLORER
         
         HTML:
         data-role="doctor"

         Detail:
         id="role-doctor"
         ===================================================== */

      var roleCards =
        $$(".role-card");

      var roleDetails =
        $$(".role-detail");

      roleCards.forEach(
        function (card) {

          addEvent(
            card,
            "click",
            function () {

              var role =
                card.getAttribute(
                  "data-role"
                );

              if (!role) {
                return;
              }

              roleCards.forEach(
                function (item) {

                  item.classList.remove(
                    "active"
                  );

                }
              );

              roleDetails.forEach(
                function (detail) {

                  detail.classList.remove(
                    "active"
                  );

                }
              );

              card.classList.add(
                "active"
              );

              var detail =
                document.getElementById(
                  "role-" +
                  role
                );

              if (detail) {

                detail.classList.add(
                  "active"
                );

              }

            }
          );


          if (
            !card.hasAttribute(
              "tabindex"
            )
          ) {

            card.setAttribute(
              "tabindex",
              "0"
            );
          }


          addEvent(
            card,
            "keydown",
            function (event) {

              if (
                event.key ===
                  "Enter" ||
                event.key ===
                  " "
              ) {

                event.preventDefault();

                card.click();

              }

            }
          );

        }
      );


      /* =====================================================
         MODULE FILTER
         ===================================================== */

      var moduleButtons =
        $$(".module-filter-btn");

      var moduleItems =
        $$(".module-item");

      var moduleSearch =
        $("#moduleSearch");

      var noResults =
        $("#module-no-results");

      var currentFilter =
        "all";


      function filterModules() {

        var searchText =
          (moduleSearch && typeof moduleSearch.value === "string")
            ? moduleSearch.value
                .trim()
                .toLowerCase()
            : "";

        var visible =
          0;

        moduleItems.forEach(
          function (item) {

            var category =
              (
                item.getAttribute(
                  "data-category"
                ) || ""
              ).toLowerCase();

            var text =
              (
                item.textContent || ""
              ).toLowerCase();

            var categoryMatch =
              currentFilter ===
                "all" ||
              category ===
                currentFilter;

            var searchMatch =
              !searchText ||
              text.indexOf(
                searchText
              ) !== -1;

            if (
              categoryMatch &&
              searchMatch
            ) {

              item.style.display =
                "";

              visible++;

            } else {

              item.style.display =
                "none";
            }

          }
        );


        if (noResults) {

          if (visible === 0) {

            noResults.style.display =
              "block";

          } else {

            noResults.style.display =
              "none";
          }
        }
      }


      moduleButtons.forEach(
        function (button) {

          addEvent(
            button,
            "click",
            function () {

              moduleButtons.forEach(
                function (item) {

                  item.classList.remove(
                    "active"
                  );

                }
              );

              button.classList.add(
                "active"
              );

              currentFilter =
                (
                  button.getAttribute(
                    "data-filter"
                  ) || "all"
                ).toLowerCase();

              filterModules();

            }
          );

        }
      );


      if (moduleSearch) {

        addEvent(
          moduleSearch,
          "input",
          filterModules
        );

      }

      filterModules();


      /* =====================================================
         INTERACTIVE MODULE DETAIL MODAL
         ===================================================== */

      var moduleDataMap = {
        "patient consultation": {
          title: "Patient Consultation (OPD / IPD)",
          category: "Clinical",
          icon: "fa-user-md",
          desc: "Comprehensive clinical consultation interface enabling physicians to review patient longitudinal history, record vitals, document symptoms, and formulate clinical decisions seamlessly.",
          features: [
            "Specialty-specific clinical examination templates & checklists",
            "Vital signs recording with historical trend comparisons",
            "Direct e-Prescription with dosage validation and safety checks",
            "Real-time diagnostic order entry (Pathology & Imaging)",
            "Integrated ICD-10 diagnostic coding support"
          ],
          depts: "OPD Clinics, Inpatient Wards, Day Care, Emergency Triage",
          workflow: "Reception Booking → Triage/Vitals → Doctor Consultation → E-Prescription & Diagnostic Orders → Billing/Pharmacy"
        },
        "electronic health records": {
          title: "Electronic Health Records (EHR)",
          category: "Clinical",
          icon: "fa-notes-medical",
          desc: "Centralized, tamper-evident digital medical repository tracking longitudinal health records, past admissions, surgical logs, allergy warnings, and diagnostic charts.",
          features: [
            "Unified patient view with UHID-based lifetime record linking",
            "High-visibility allergy, chronic condition, and critical alert badges",
            "Digital document upload & diagnostic report archiving",
            "Role-based clinical access control compliant with healthcare privacy standards",
            "Comprehensive audit trail tracking every chart access and update"
          ],
          depts: "Medical Records Department (MRD), All Clinical Units, Nursing",
          workflow: "Admission → Clinical Encounters → Investigation Results → Discharge Summary → Long-term Digital Archival"
        },
        "nursing": {
          title: "Nursing & Ward Care",
          category: "Clinical",
          icon: "fa-user-nurse",
          desc: "Empowers ward and ICU nurses to monitor patient progress, manage shift handovers, execute doctor clinical orders, and administer medication accurately.",
          features: [
            "Bedside vital recording & automated intake/output charts",
            "Medication Administration Record (e-MAR) tracking and confirmation",
            "Nurse clinical notes, shift handover summaries & doctor order sign-offs",
            "Ward consumable indenting & automatic bed status updates"
          ],
          depts: "General Wards, Semi-Private, Deluxe, ICU, Emergency",
          workflow: "Bed Allocation → Ward Transfer → Daily Round Charting → Medication Administration → Discharge Clearance"
        },
        "lims": {
          title: "Laboratory Information Management (LIMS)",
          category: "Diagnostic",
          icon: "fa-flask",
          desc: "End-to-end pathology workflow management spanning test ordering, barcode sample collection, bidirectional analyzer interfacing, and multi-tier report approval.",
          features: [
            "Instant sample barcode label generation at phlebotomy point",
            "Bidirectional interfacing with biochemistry & hematology auto-analyzers",
            "Normal range validations with abnormal / panic critical alerts",
            "Multi-tier pathologist review, digital signature & patient SMS/portal release"
          ],
          depts: "Biochemistry, Pathology, Hematology, Microbiology, Serology",
          workflow: "Doctor Order → Phlebotomy & Barcoding → Analyzer Interface → Pathologist Verification → EHR & Billing Sync"
        },
        "ris": {
          title: "Radiology Information System (RIS)",
          category: "Diagnostic",
          icon: "fa-x-ray",
          desc: "Integrated radiology department software managing modality appointment schedules, technician worklists, PACS connectivity, and structured radiologist reporting.",
          features: [
            "Modality appointment slots (X-Ray, Ultrasound, CT, MRI)",
            "Technician scan completion worklists",
            "PACS integration supporting DICOM viewing",
            "Pre-built diagnostic templates for faster report turnaround"
          ],
          depts: "Radiology, Imaging Center, Ultrasonography, CT/MRI Suite",
          workflow: "Investigation Requisition → Modality Scheduling → Imaging Acquisition → Radiologist Reporting → Clinician Review"
        },
        "equipment integration": {
          title: "External Equipment & Machine Interfacing",
          category: "Diagnostic",
          icon: "fa-microchip",
          desc: "Automated communication layer connecting medical diagnostic machines and IoT healthcare hardware directly to TRIO HIMS databases.",
          features: [
            "Bidirectional RS232 / TCP-IP auto-analyzer interfacing",
            "Zero manual result re-entry, eliminating typographical transcription errors",
            "Real-time equipment connectivity status monitoring",
            "Barcode & RFID patient identifier scanning support"
          ],
          depts: "Central Diagnostic Labs, Radiology, ICU Telemetry",
          workflow: "Sample Load → Machine Protocol Handshake → Raw Data Capture → Validation Engine → LIMS Publishing"
        },
        "billing": {
          title: "Billing & Cash Counter Management",
          category: "Financial",
          icon: "fa-file-invoice-dollar",
          desc: "Comprehensive hospital revenue engine ensuring zero revenue leakage by aggregating OPD, IPD, lab, pharmacy, and surgical service charges automatically.",
          features: [
            "Automated tariff schedules customized by ward, payer, or corporate tier",
            "Real-time interim IPD billing with advance deposit adjustments",
            "TPA & corporate credit billing with pre-authorization tracking",
            "Shift-wise cash drawer reconciliation & receipt generation"
          ],
          depts: "Cash Counters, TPA / Insurance Desk, Billing Department",
          workflow: "Service Order → Auto Charge Posting → Advance Deposit Deduction → Final Bill Audit → Payment & Receipt"
        },
        "financial accounting": {
          title: "Financial Accounting & Tally Integration",
          category: "Financial",
          icon: "fa-calculator",
          desc: "Enterprise accounting and general ledger system with direct voucher export to Tally for audit-ready hospital accounting.",
          features: [
            "General ledger, accounts receivable, and accounts payable",
            "Seamless synchronization with Tally ERP / Tally Prime",
            "Doctor payout & fee-sharing calculation based on conducted procedures",
            "Comprehensive balance sheets, P&L statements, and trial balance"
          ],
          depts: "Accounts Department, Finance Office, Executive Board",
          workflow: "Daily Billing Reconciliation → Automated Voucher Creation → Tally Sync → Audit & Statutory Compliance"
        },
        "pharmacy": {
          title: "Pharmacy & Retail Dispensing",
          category: "Operations",
          icon: "fa-pills",
          desc: "Pharmacy point-of-sale supporting e-prescription dispensing, batch-level inventory tracking, narcotic drug registers, and automated stock reorder triggers.",
          features: [
            "Direct e-Prescription fetching from OPD & IPD doctor consultations",
            "First-Expiry First-Out (FEFO) dispensing algorithms",
            "Return management with credit note generation",
            "Drug interaction checks & generic substitution alternatives"
          ],
          depts: "Hospital In-house Pharmacy, Retail Counter, Chemist Shop",
          workflow: "Doctor E-Rx → Dispensing Verification → Batch Selection → Counter Bill Generation → Stock Auto-Deduction"
        },
        "stores": {
          title: "Stores & Central Inventory Management",
          category: "Operations",
          icon: "fa-boxes-stacked",
          desc: "Hospital material management streamlining purchase requisitions, supplier quotation comparisons, purchase orders, Goods Receipt Notes (GRN), and department indenting.",
          features: [
            "Multi-level department indenting with approval hierarchy",
            "Automated Reorder Level (ROL) calculations preventing stockouts",
            "GRN generation with batch verification & supplier bill matching",
            "Dead stock, slow-moving items, and consumption analysis reports"
          ],
          depts: "Central Warehouse, Department Stores, Purchasing Office",
          workflow: "Department Indent → Store Issue → Purchase Requisition → PO to Supplier → GRN & Stock Inward"
        },
        "operation theatre": {
          title: "Operation Theatre (OT) Management",
          category: "Operations",
          icon: "fa-procedures",
          desc: "Coordinates surgical scheduling, surgeon and anesthesiologist rosters, PAC records, pre-op checklists, implant tracking, and post-op recovery notes.",
          features: [
            "OT table calendar & slot allocation with clash prevention",
            "Pre-Anesthesia Checkup (PAC) and consent documentation",
            "Intra-operative monitoring, surgical consumables & implant tracking",
            "PACU (Post-Anesthesia Care Unit) vital monitoring & handover"
          ],
          depts: "Operation Theatre Suite, Anesthesiology, Surgical Wards",
          workflow: "Surgery Booking → PAC Clearance → Pre-op Checklist → Surgical Procedure → Post-op Recovery Handover"
        },
        "diet": {
          title: "Diet & Kitchen Management",
          category: "Operations",
          icon: "fa-utensils",
          desc: "Manages therapeutic inpatient nutritional planning, meal orders based on clinical conditions (diabetic, renal, soft diet), and kitchen preparation lists.",
          features: [
            "Doctor/dietitian clinical diet prescription in patient charts",
            "Meal schedules categorized by breakfast, lunch, tea, and dinner",
            "Ward-wise meal delivery tracking and dietary calorie calculations",
            "Kitchen raw material provisioning and grocery store requisitions"
          ],
          depts: "Dietetics & Nutrition, Hospital Kitchen, IPD Wards",
          workflow: "Clinical Diet Order → Kitchen Preparation List → Meal Delivery to Ward → Dietary Feedback Charting"
        },
        "human resources": {
          title: "Human Resources (HR) & Rostering",
          category: "Administration",
          icon: "fa-users",
          desc: "Staff management for hospital doctors, nurses, paramedics, and administrative personnel covering shift rosters, attendance, leave, and payroll processing.",
          features: [
            "Shift rostering tailored for 24/7 rotating hospital operations",
            "Biometric attendance integration & leave approval workflows",
            "Medical license, credentialing & expiration tracking for clinicians",
            "Salary structure setup and monthly payroll compilation"
          ],
          depts: "HR Department, Nursing Administration, Management Office",
          workflow: "Shift Schedule Planning → Biometric Attendance Log → Leave & Overtime → Monthly Payroll Run"
        },
        "asset maintenance": {
          title: "Biomedical Asset & Facility Maintenance",
          category: "Administration",
          icon: "fa-screwdriver-wrench",
          desc: "Lifecycle management for biomedical equipment and hospital physical infrastructure, managing Annual Maintenance Contracts (AMC/CMC) and breakdown complaints.",
          features: [
            "Asset tagging with barcode identification & history logs",
            "Preventive Maintenance (PM) schedules & calibration reminders",
            "AMC / CMC contract tracking with vendor contact details",
            "Department breakdown ticket generation with SLA tracking"
          ],
          depts: "Biomedical Engineering, Maintenance, Hospital Facilities",
          workflow: "Breakdown Ticket / PM Due → Work Order Issued → Technician Resolution → Sign-off & History Update"
        },
        "visitor management": {
          title: "Visitor & Gate Pass Management",
          category: "Administration",
          icon: "fa-id-card",
          desc: "Regulates hospital security and visitor movement by issuing electronic visitor passes linked to specific inpatient admission beds and visiting hours.",
          features: [
            "Photo capture & instant visitor pass barcode printing",
            "Bed-linked visitor quota enforcement to prevent ward overcrowding",
            "Visiting hours restriction validation at security checkpoints",
            "Historical visitor logs for audit compliance"
          ],
          depts: "Hospital Reception, Security Gate, IPD Inpatient Wards",
          workflow: "Visitor Arrives → Patient Verification → Pass Issued → Ward Visit → Exit Barcode Scan"
        },
        "license management": {
          title: "Hospital Statutory & License Management",
          category: "Administration",
          icon: "fa-certificate",
          desc: "Organizes mandatory hospital licenses, statutory regulatory clearances, and bio-medical waste compliance documents with proactive renewal alerts.",
          features: [
            "Centralized document vault for Clinical Establishment licenses",
            "Pollution control, AERB (radiology), fire safety & pharmacy license tracking",
            "Automated alerts 60/30/15 days prior to license expirations",
            "Compliance certificate download for hospital accreditation (NABH)"
          ],
          depts: "Legal & Compliance, Medical Superintendent, Hospital Quality",
          workflow: "License Registration → Document Upload → Renewal Countdown Alerts → Compliance Verification"
        }
      };

      var moduleModalEl = document.getElementById("moduleModal");
      var moduleModalInstance = null;

      if (moduleModalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
        moduleModalInstance = bootstrap.Modal.getOrCreateInstance(moduleModalEl);
      }

      $$(".module-box").forEach(function (box) {
        box.setAttribute("role", "button");
        box.setAttribute("tabindex", "0");
        box.setAttribute("aria-label", "View module details");

        function openModuleDetail() {
          var titleEl = $("h4", box);
          var moduleTitle = titleEl ? titleEl.textContent.trim() : "";
          var lowerTitle = moduleTitle.toLowerCase();

          var matchedKey = null;
          Object.keys(moduleDataMap).forEach(function (key) {
            if (lowerTitle.indexOf(key) !== -1 || key.indexOf(lowerTitle) !== -1) {
              matchedKey = key;
            }
          });

          var data = matchedKey ? moduleDataMap[matchedKey] : null;

          if (!data) {
            data = {
              title: moduleTitle,
              category: "Hospital Module",
              icon: "fa-hospital",
              desc: ($("p", box) ? $("p", box).textContent.trim() : "Comprehensive operational workflow module within TRIO HIMS."),
              features: [
                "Seamless synchronization with central TRIO HIMS database",
                "Role-based permission access control for departmental staff",
                "Built-in audit trails and statutory reporting support",
                "Reduces manual administrative effort and eliminates data silos"
              ],
              depts: "Hospital Operations, Department Staff",
              workflow: "Department Inward → Operational Processing → Record Archival → Administrative Reporting"
            };
          }

          var labelEl = $("#moduleModalLabel");
          var categoryEl = $("#modalModuleCategory");
          var descEl = $("#modalModuleDesc");
          var iconEl = $("#modalModuleIcon");
          var featuresEl = $("#modalModuleFeatures");
          var deptEl = $("#modalModuleDept");
          var workflowEl = $("#modalModuleWorkflow");

          if (labelEl) labelEl.textContent = data.title;
          if (categoryEl) categoryEl.textContent = data.category;
          if (descEl) descEl.textContent = data.desc;
          if (iconEl) iconEl.innerHTML = '<i class="fas ' + data.icon + '"></i>';
          if (deptEl) deptEl.textContent = data.depts;
          if (workflowEl) workflowEl.textContent = data.workflow;

          if (featuresEl) {
            featuresEl.innerHTML = "";
            data.features.forEach(function (feat) {
              var li = document.createElement("li");
              li.className = "d-flex align-items-start gap-2";
              li.innerHTML = '<i class="fas fa-check-circle text-primary mt-1 flex-shrink-0"></i><span>' + feat + '</span>';
              featuresEl.appendChild(li);
            });
          }

          if (moduleModalInstance) {
            moduleModalInstance.show();
          } else if (moduleModalEl) {
            $(moduleModalEl).modal ? $(moduleModalEl).modal("show") : null;
          }
        }

        addEvent(box, "click", openModuleDetail);
        addEvent(box, "keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModuleDetail();
          }
        });
      });


      /* =====================================================
         60-SECOND PRODUCT TOUR INTERACTION
         ===================================================== */

      var tourSteps = $$(".tour-step");
      var tourPanels = $$(".tour-panel");
      var tourPrev = $("#tourPrev");
      var tourNext = $("#tourNext");
      var tourCounter = $("#tourCounter");
      var tourProgressBar = $("#tourProgressBar");
      var currentTourIndex = 0;

      function updateTour(index) {
        if (index < 0 || index >= tourSteps.length) return;

        tourSteps.forEach(function (step, idx) {
          if (idx === index) {
            step.classList.add("active");
            step.setAttribute("aria-selected", "true");
          } else {
            step.classList.remove("active");
            step.setAttribute("aria-selected", "false");
          }
        });

        tourPanels.forEach(function (panel, idx) {
          if (idx === index) {
            panel.classList.add("active");
          } else {
            panel.classList.remove("active");
          }
        });

        currentTourIndex = index;

        if (tourCounter) {
          tourCounter.textContent = "Step " + (index + 1) + " of " + tourSteps.length;
        }

        if (tourProgressBar) {
          var progressPct = ((index + 1) / tourSteps.length) * 100;
          tourProgressBar.style.width = progressPct + "%";
        }

        if (tourPrev) {
          tourPrev.disabled = index === 0;
        }

        if (tourNext) {
          tourNext.disabled = index === tourSteps.length - 1;
        }
      }

      tourSteps.forEach(function (step, idx) {
        addEvent(step, "click", function () {
          updateTour(idx);
        });

        addEvent(step, "keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            updateTour(idx);
          }
        });
      });

      if (tourPrev) {
        addEvent(tourPrev, "click", function () {
          if (currentTourIndex > 0) {
            updateTour(currentTourIndex - 1);
          }
        });
      }

      if (tourNext) {
        addEvent(tourNext, "click", function () {
          if (currentTourIndex < tourSteps.length - 1) {
            updateTour(currentTourIndex + 1);
          }
        });
      }

      if (tourSteps.length > 0) {
        updateTour(0);
      }


      /* =====================================================
         WORKFLOW TABS
         ===================================================== */

      var workflowTabs =
        $$(".workflow-tab");

      var workflowPanels =
        $$(".wf-panel");

      workflowTabs.forEach(
        function (tab) {

          addEvent(
            tab,
            "click",
            function () {

              var target =
                tab.getAttribute(
                  "data-workflow"
                );

              if (!target) {

                target =
                  tab.getAttribute(
                    "data-target"
                  );
              }

              if (!target) {
                return;
              }

              if (
                target.charAt(0) === "#"
              ) {

                target =
                  target.substring(1);
              }

              workflowTabs.forEach(
                function (item) {

                  item.classList.remove(
                    "active"
                  );

                }
              );

              workflowPanels.forEach(
                function (panel) {

                  panel.classList.remove(
                    "active"
                  );

                }
              );

              tab.classList.add(
                "active"
              );

              var panel =
                document.getElementById(
                  target
                );

              if (panel) {

                panel.classList.add(
                  "active"
                );

              }

            }
          );

        }
      );


      /* =====================================================
         MODULE FINDER
         ===================================================== */

      var findButton =
        $("#findModulesBtn");

      var resetButton =
        $("#resetFinderBtn");

      var resultList =
        $("#finderResultList");

      var checkboxes =
        $$(
          '#module-finder input[type="checkbox"]'
        );


      var moduleRecommendations = {

        clinical: [
          "RADT",
          "Patient Consultation OP/IP",
          "EHR",
          "Nursing",
          "OT"
        ],

        lab: [
          "LIMS",
          "External Equipment Integration"
        ],

        pharmacy: [
          "Pharmacy",
          "Stores / Inventory"
        ],

        billing: [
          "Billing / Cash Counter",
          "Financial Accounting",
          "Tally Integration"
        ],

        hr: [
          "HR Management",
          "Roster Management"
        ],

        inventory: [
          "Stores / Inventory",
          "Asset Maintenance"
        ],

        radiology: [
          "RIS",
          "Radiology",
          "External Equipment Integration"
        ],

        accounting: [
          "Financial Accounting",
          "Tally Integration",
          "Billing / Cash Counter"
        ],

        ot: [
          "OT Management",
          "Nursing"
        ],

        admin: [
          "License Management",
          "Visitor Management",
          "Asset Maintenance"
        ]

      };


      function showFinderResults() {

        if (!resultList) {
          return;
        }

        var selected =
          [];

        checkboxes.forEach(
          function (checkbox) {

            if (
              checkbox.checked
            ) {

              selected.push(
                checkbox.value
              );

            }

          }
        );


        if (
          selected.length === 0
        ) {

          resultList.innerHTML =
            '<p class="finder-placeholder">' +
            '<i class="fas fa-hand-pointer"></i> ' +
            'Select areas above to see matching TRIO modules' +
            "</p>";

          return;
        }


        var results =
          [];


        selected.forEach(
          function (category) {

            var modules =
              moduleRecommendations[
                category
              ] || [];

            modules.forEach(
              function (moduleName) {

                if (
                  results.indexOf(
                    moduleName
                  ) === -1
                ) {

                  results.push(
                    moduleName
                  );

                }

              }
            );

          }
        );


        resultList.innerHTML =
          "";


        results.forEach(
          function (moduleName) {

            var item =
              document.createElement(
                "div"
              );

            item.className =
              "finder-result-item";

            item.innerHTML =
              '<i class="fas fa-check-circle"></i>' +
              "<span>" +
              moduleName +
              "</span>";

            resultList.appendChild(
              item
            );

          }
        );

      }


      if (findButton) {

        addEvent(
          findButton,
          "click",
          showFinderResults
        );

      }


      if (resetButton) {

        addEvent(
          resetButton,
          "click",
          function () {

            checkboxes.forEach(
              function (checkbox) {

                checkbox.checked =
                  false;

                var label =
                  checkbox.closest(
                    "label"
                  );

                if (label) {

                  label.classList.remove(
                    "selected"
                  );

                }

              }
            );


            if (resultList) {

              resultList.innerHTML =
                '<p class="finder-placeholder">' +
                '<i class="fas fa-hand-pointer"></i> ' +
                'Select areas above to see matching TRIO modules' +
                "</p>";

            }

          }
        );

      }


      checkboxes.forEach(
        function (checkbox) {

          addEvent(
            checkbox,
            "change",
            function () {

              var label =
                checkbox.closest(
                  "label"
                );

              if (label) {

                label.classList.toggle(
                  "selected",
                  checkbox.checked
                );

              }

            }
          );

        }
      );


      /* =====================================================
         TESTIMONIAL SWIPER
         
         IMPORTANT:
         Existing HTML uses:
         .testimonials-slider
         ===================================================== */

      if (
        typeof Swiper !==
        "undefined"
      ) {

        var testimonialElement =
          $(".testimonials-slider");

        if (
          testimonialElement
        ) {

          /*
           * Prevent duplicate initialization.
           */
          if (
            !testimonialElement.classList.contains(
              "swiper-initialized"
            )
          ) {

            try {

              new Swiper(
                testimonialElement,
                {
                  loop: true,

                  speed: 600,

                  autoplay: {
                    delay: 5000,
                    disableOnInteraction:
                      false
                  },

                  slidesPerView: 1,

                  spaceBetween: 20,

                  pagination: {
                    el:
                      ".testimonials-slider .swiper-pagination",
                    clickable:
                      true
                  },

                  breakpoints: {

                    768: {
                      slidesPerView: 2
                    },

                    992: {
                      slidesPerView: 3
                    }

                  }

                }
              );

            } catch (error) {

              console.warn(
                "TRIO testimonial slider could not initialize:",
                error
              );

            }

          }

        }

      }


      /* =====================================================
         GLIGHTBOX
         ===================================================== */

      if (
        typeof GLightbox !==
        "undefined"
      ) {

        if (
          $$(".glightbox").length
        ) {

          try {

            GLightbox({
              selector:
                ".glightbox"
            });

          } catch (error) {

            console.warn(
              "TRIO GLightbox could not initialize:",
              error
            );

          }

        }

      }


      /* =====================================================
         PURECOUNTER
         ===================================================== */

      if (
        typeof PureCounter !==
        "undefined"
      ) {

        try {

          new PureCounter();

        } catch (error) {

          console.warn(
            "TRIO PureCounter could not initialize:",
            error
          );

        }

      }


      /* =====================================================
         FORM VALIDATION
         ===================================================== */

      $$("form").forEach(
        function (form) {

          var phoneInputs =
            $$(
              'input[type="tel"]',
              form
            );

          phoneInputs.forEach(
            function (input) {

              addEvent(
                input,
                "input",
                function () {

                  var value =
                    input.value.replace(
                      /\D/g,
                      ""
                    );

                  input.value =
                    value.substring(
                      0,
                      10
                    );

                }
              );

            }
          );


          addEvent(
            form,
            "submit",
            function (event) {

              var valid =
                true;


              /*
               * Required fields
               */

              $$(
                "input[required], textarea[required], select[required]",
                form
              ).forEach(
                function (field) {

                  if (
                    !field.value.trim()
                  ) {

                    valid =
                      false;

                    field.classList.add(
                      "is-invalid"
                    );

                  } else {

                    field.classList.remove(
                      "is-invalid"
                    );

                  }

                }
              );


              /*
               * Email
               */

              $$(
                'input[type="email"]',
                form
              ).forEach(
                function (field) {

                  var value =
                    field.value.trim();

                  if (
                    value &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      value
                    )
                  ) {

                    valid =
                      false;

                    field.classList.add(
                      "is-invalid"
                    );

                  }

                }
              );


              /*
               * Phone
               *
               * Original TRIO HTML accepts
               * any 10-digit number beginning
               * with 1-9.
               */

              phoneInputs.forEach(
                function (field) {

                  var value =
                    field.value.replace(
                      /\D/g,
                      ""
                    );

                  if (
                    value &&
                    !/^[1-9][0-9]{9}$/.test(
                      value
                    )
                  ) {

                    valid =
                      false;

                    field.classList.add(
                      "is-invalid"
                    );

                  }

                }
              );


              if (!valid) {

                event.preventDefault();

                var invalid =
                  $(".is-invalid", form);

                if (invalid) {

                  invalid.focus();

                }

              } else {

                /* Handle frontend submission feedback gracefully */
                event.preventDefault();

                var submitBtn =
                  $('button[type="submit"]', form);

                var originalBtnText =
                  submitBtn ? submitBtn.innerHTML : "Submit";

                if (submitBtn) {
                  submitBtn.disabled = true;
                  submitBtn.innerHTML =
                    '<i class="fas fa-spinner fa-spin me-2"></i> Processing Request...';
                }

                var loadingEl = $(".loading", form);
                var errorEl = $(".error-message", form);
                var sentEl = $(".sent-message", form);

                if (loadingEl) loadingEl.style.display = "block";
                if (errorEl) errorEl.style.display = "none";

                setTimeout(function () {
                  if (loadingEl) loadingEl.style.display = "none";
                  if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                  }

                  if (sentEl) {
                    sentEl.style.display = "block";
                  }

                  if (typeof Swal !== "undefined") {
                    Swal.fire({
                      icon: "success",
                      title: "Demo Request Received",
                      text: "Thank you for your interest in TRIO HIMS. Our healthcare solutions team will contact you shortly to arrange your personalized product demonstration.",
                      confirmButtonColor: "#1977cc"
                    });
                  }

                  form.reset();

                  /* If in modal, close after a delay */
                  var modalEl = form.closest(".modal");
                  if (modalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
                    setTimeout(function () {
                      var modalInstance = bootstrap.Modal.getInstance(modalEl);
                      if (modalInstance) {
                        modalInstance.hide();
                      }
                      if (sentEl) sentEl.style.display = "none";
                    }, 2500);
                  }
                }, 900);

              }

            }
          );


          /*
           * Remove error while typing
           */

          $$(
            "input, textarea, select",
            form
          ).forEach(
            function (field) {

              addEvent(
                field,
                "input",
                function () {

                  if (
                    field.value.trim()
                  ) {

                    field.classList.remove(
                      "is-invalid"
                    );

                  }

                }
              );

            }
          );

        }
      );


      /* =====================================================
         FOOTER YEAR
         ===================================================== */

      var footerYear =
        $("#footer-year");

      if (footerYear) {

        footerYear.textContent =
          new Date().getFullYear();

      }


      /* =====================================================
         DASHBOARD DATE
         ===================================================== */

      var dashboardDate =
        $("#dashboardDate");

      if (dashboardDate) {

        dashboardDate.textContent =
          new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          );

      }


      /* =====================================================
         EXTERNAL LINK SECURITY
         ===================================================== */

      $$(
        'a[target="_blank"]'
      ).forEach(
        function (link) {

          var rel =
            link.getAttribute(
              "rel"
            ) || "";

          if (
            rel.indexOf(
              "noopener"
            ) === -1
          ) {

            rel +=
              " noopener";

          }

          if (
            rel.indexOf(
              "noreferrer"
            ) === -1
          ) {

            rel +=
              " noreferrer";

          }

          link.setAttribute(
            "rel",
            rel.trim()
          );

        }
      );


      /* =====================================================
         REDUCED MOTION
         ===================================================== */

      if (
        window.matchMedia &&
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      ) {

        document.documentElement.classList.add(
          "reduce-motion"
        );

      }


      /* =====================================================
         ACCESSIBILITY
         ===================================================== */

      $$(".role-card").forEach(
        function (card) {

          if (
            !card.hasAttribute(
              "tabindex"
            )
          ) {

            card.setAttribute(
              "tabindex",
              "0"
            );

          }

        }
      );


      /* =====================================================
         PAGE READY
         ===================================================== */

      document.body.classList.add(
        "trio-js-ready"
      );


      console.log(
        "TRIO HIMS JavaScript loaded successfully."
      );

    }
  );

})();