"""Generate Kamvala project documentation PDF."""
from pathlib import Path
from fpdf import FPDF

OUT = Path(__file__).resolve().parent / "Kamvala-Project-Documentation.pdf"


class DocPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 8, "Kamvala - FWD Project Documentation", align="R", new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def section_title(self, title: str):
        self.set_x(self.l_margin)
        self.ln(4)
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(0, 122, 255)
        self.multi_cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def sub_title(self, title: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(28, 28, 30)
        self.multi_cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body(self, text: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(28, 28, 30)
        self.multi_cell(0, 5.5, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def bullet(self, text: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(28, 28, 30)
        self.multi_cell(0, 5.5, f"  - {text}", new_x="LMARGIN", new_y="NEXT")


def build():
    pdf = DocPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # Title page
    pdf.ln(35)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(0, 122, 255)
    pdf.cell(0, 12, "Kamvala", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(28, 28, 30)
    pdf.cell(0, 9, "A Location-Based Local Job Matching Application", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 7, "FWD Course Project - Technical Documentation", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(20)
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 6, "Domain: Local job matching for shops in Hyderabad, India", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "Stack: React 19, TypeScript, Vite, Mapbox, JSON Server", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "Date: June 2026", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.add_page()

    pdf.section_title("1. Introduction")
    pdf.body(
        "Kamvala is a location-based job discovery application that connects job seekers "
        "with nearby shops hiring local help. Unlike large professional networks, Kamvala "
        "focuses on everyday work - cashiers, cooks, delivery riders, cleaners - found "
        "within walking or short commute distance."
    )
    pdf.body(
        "The app is built as a React single-page application displayed inside an iPhone-style "
        "phone mockup. It uses a mock REST API (JSON Server) for listings and Mapbox for "
        "interactive maps."
    )

    pdf.section_title("2. Problem Statement")
    pdf.body(
        "Many small shops in Indian cities hire through word-of-mouth or handwritten notices. "
        "Job seekers often do not know which shops nearby are hiring, what languages are needed, "
        "or what pay is offered."
    )
    pdf.bullet("Job seekers browse openings on a map within a chosen radius (1-10 km).")
    pdf.bullet("Shop owners enlist their shop and post a job listing with location, pay, and languages.")
    pdf.bullet("Everything stays local - no resume upload, no corporate hiring pipeline.")

    pdf.section_title("3. Main Features")
    pdf.sub_title("Intro Screen (/)")
    pdf.bullet("Landing page with Kamvala brand and two cards: Find a Job and Enlist Shop.")

    pdf.sub_title("Explore (/explore)")
    pdf.bullet("Mapbox map centred on user GPS or Hyderabad demo area.")
    pdf.bullet("Radius selector: 1, 2, 5, or 10 km.")
    pdf.bullet("Job pins on map; filter by job type, language, and minimum pay.")
    pdf.bullet("Bottom sheet list of nearby jobs.")

    pdf.sub_title("Job Detail (/explore/:id)")
    pdf.bullet("Full listing with store photo, pay, languages, call shop, get directions.")

    pdf.sub_title("Enlist (/enlist)")
    pdf.bullet("iOS-style form: shop name, job title, work types, languages, pay, address.")
    pdf.bullet("Optional store image and map pin picker for exact location.")
    pdf.bullet("On submit: listing saved, map centre updated, user navigates to Explore.")

    pdf.add_page()

    pdf.section_title("4. Technology Stack")
    pdf.bullet("React 19 + TypeScript + Vite 8")
    pdf.bullet("Tailwind CSS v4 with custom iOS-like UI components")
    pdf.bullet("React Router v7 with lazy-loaded pages")
    pdf.bullet("Mapbox GL JS + react-map-gl v8")
    pdf.bullet("JSON Server mock API on port 3001")
    pdf.bullet("Vitest + React Testing Library")
    pdf.bullet("Haversine formula for client-side radius filtering")

    pdf.section_title("5. Application Architecture")
    pdf.body(
        "The app wraps all pages in a PhoneFrame shell. Inside, three React contexts manage "
        "global state: LocationContext (map centre from GPS), FilterContext (radius and filters), "
        "and ListingsContext (refresh and local listings after enlist)."
    )
    pdf.body(
        "Services layer: apiClient (fetch wrapper), listingsService (CRUD + merge + filters), "
        "and geo (Haversine distance). Hooks: useGeolocation and useNearbyListings."
    )

    pdf.section_title("6. Routing")
    pdf.bullet("/ - Intro (tab bar hidden)")
    pdf.bullet("/explore - Map + job list (Explore | Enlist tabs)")
    pdf.bullet("/explore/:id - Job detail (back button, no tabs)")
    pdf.bullet("/enlist - Shop enlist form")

    pdf.section_title("7. API and Data Flow")
    pdf.body("REST endpoints proxied via Vite at /api:")
    pdf.bullet("GET /listings - all job listings")
    pdf.bullet("GET /listings/:id - single listing")
    pdf.bullet("POST /listings - create listing (shop enlist)")
    pdf.bullet("GET /jobTypes and GET /languages - dropdown options")

    pdf.sub_title("Enlist to Explore flow")
    pdf.bullet("User submits enlist form with map pin location.")
    pdf.bullet("POST saves listing to db.json (or local fallback if API is down).")
    pdf.bullet("Listing added to ListingsContext immediately for instant display.")
    pdf.bullet("Map centre moves to shop pin; filters cleared; app opens Explore.")
    pdf.bullet("Haversine filter shows only jobs within selected radius.")

    pdf.add_page()

    pdf.section_title("8. Geolocation and Radius Search")
    pdf.body(
        "Default centre is Hyderabad (17.385 N, 78.4867 E). If the user allows location, "
        "the map uses GPS coordinates. Radius options are 1, 2, 5, and 10 km. Distance is "
        "computed with the Haversine formula on the client. A blue circle on the map shows "
        "the search radius."
    )

    pdf.section_title("9. Mapbox Integration")
    pdf.bullet("Token in .env as VITE_MAPBOX_TOKEN")
    pdf.bullet("CSP build + web worker for Vite compatibility")
    pdf.bullet("JobMap for explore view; MapPinPicker for enlist form")
    pdf.bullet("Fallback message if no token - rest of app still works")

    pdf.section_title("10. UI / UX Design")
    pdf.body(
        "The interface follows Apple iOS patterns: large titles, grouped lists, segmented "
        "controls, frosted tab bar, Dynamic Island phone frame (~430px wide), and hidden "
        "scrollbars inside the phone mockup."
    )

    pdf.section_title("11. Project Structure")
    pdf.bullet("src/pages - Intro, Explore, JobDetail, Enlist")
    pdf.bullet("src/components - layout, map, jobs, shop, ui")
    pdf.bullet("src/context - Location, Filter, Listings")
    pdf.bullet("src/services - apiClient, listingsService, geo")
    pdf.bullet("db.json - 10 seeded Hyderabad listings")

    pdf.section_title("12. How to Run")
    pdf.bullet("npm install")
    pdf.bullet("cp .env.example .env and add Mapbox token")
    pdf.bullet("npm run dev - Vite on :5173 + JSON Server on :3001")
    pdf.bullet("npm test - run unit tests")
    pdf.bullet("npm run build - production build")

    pdf.section_title("13. Course Learning Outcomes (FWD)")
    pdf.bullet("Frontend development - React components, hooks, context, mobile UI")
    pdf.bullet("Routing and navigation - lazy routes and tab shell")
    pdf.bullet("API integration - REST client, POST/GET, proxy, fallback")
    pdf.bullet("Geospatial logic - GPS, Haversine radius, map markers")
    pdf.bullet("State management - multiple React contexts")
    pdf.bullet("Testing - Vitest for geo, listings, forms, and pages")
    pdf.bullet("External services - Mapbox integration with env config")

    pdf.section_title("14. Summary")
    pdf.body(
        "Kamvala is a complete mobile-style job marketplace prototype for Hyderabad. "
        "Job seekers explore nearby openings on a map; shop owners enlist with a simple form. "
        "The architecture separates UI, state, services, and data, making it straightforward "
        "to extend with a real backend, authentication, or notifications in future work."
    )

    pdf.output(OUT)
    print(f"Created: {OUT}")


if __name__ == "__main__":
    build()
