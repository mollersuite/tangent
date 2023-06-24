use adw::prelude::*;
use gtk::prelude::*;
use relm4::prelude::*;
use relm4::{
    binding::{ConnectBindingExt, StringBinding},
    gtk, ComponentParts, ComponentSender, RelmApp, RelmWidgetExt, SimpleComponent,
};
use webkit6::{traits::*, WebView};

struct AppModel {}

#[derive(Debug)]
enum AppMsg {
    Go,
    About,
}

#[relm4::component]
impl SimpleComponent for AppModel {
    type Init = (); // These would be the props but this is the entry point

    type Input = AppMsg;
    type Output = ();

    view! {
        adw::ApplicationWindow {
            set_title: Some("Tangent"),
            set_default_width: 300,
            set_default_height: 100,
            add_css_class: if cfg!(debug_assertions) { "devel" } else {""},

            adw::Leaflet {
                gtk::Box {
                    set_orientation: gtk::Orientation::Horizontal,
                    gtk::Box {
                        set_valign: gtk::Align::Start,
                        set_vexpand: true,
                        set_orientation: gtk::Orientation::Vertical,
                        gtk::Box {
                            set_valign: gtk::Align::Start,
                            set_vexpand: false,
                            set_orientation: gtk::Orientation::Horizontal,
                            add_css_class: "toolbar",
                            gtk::WindowControls {
                                set_side: gtk::PackType::Start,
                                set_decoration_layout: Some("close")
                            },
                            gtk::Button {
                                set_icon_name: "help-about-symbolic",
                                set_tooltip_text: Some("About Tangent"),
                                connect_clicked => AppMsg::About
                            },
                        },
                        adw::EntryRow {
                            set_title: "URL"
                        },
                        gtk::Box {
                            set_valign: gtk::Align::Start,
                            set_vexpand: true,
                            set_orientation: gtk::Orientation::Vertical,
                            set_spacing: 10,
                            set_margin_all: 10,
                            add_css_class: "navigation-sidebar",
                            gtk::Button {
                                set_label: "Introducing Tangent - Etcetera",
                            },
                            gtk::Button {
                                inline_css: "margin-left: 1ch;",
                                set_label: "The WWWorst App Store",
                                add_css_class: "link-button"
                            }
                        }
                    },

                    WebView {
                        // set_editable: true,
                        set_valign: gtk::Align::Fill,
                        set_vexpand: true,
                        set_halign: gtk::Align::Fill,
                        set_hexpand: true,
                        set_settings: &({
                            let settings = webkit6::Settings::new();
                            settings.set_enable_developer_extras(true);
                            settings
                        }),
                        load_uri: "https://en.wikipedia.org"//"http://127.0.0.1:3000/"
                    }
                }
            }
        }
    }

    // Initialize the UI.
    fn init(
        init: Self::Init,
        root: &Self::Root,
        sender: ComponentSender<Self>,
    ) -> ComponentParts<Self> {
        let model = AppModel {};

        // Insert the macro code generation here
        let widgets = view_output!();

        ComponentParts { model, widgets }
    }

    fn update(&mut self, msg: Self::Input, _sender: ComponentSender<Self>) {
        match msg {
            AppMsg::Go => {
                println!("Go!");
            }
            AppMsg::About => {
                let dialog = adw::AboutWindow::builder()
                    // .transient_for(&self.widgets.root)
                    .modal(true)
                    .application_name("Tangent")
                    .comments("Go on tangents. The only browser built for rabbit holes.")
                    .developer_name("Etcetera")
                    .developers(["Jack W. https://jack.cab"])
                    .designers([
                        "Jack W. https://jack.cab",
                        "Jack H. https://hunktwink123.webflow.io",
                    ])
                    .license_type(gtk::License::Gpl30)
                    .version(option_env!("CARGO_PKG_VERSION").unwrap_or("unknown"))
                    .issue_url("https://github.com/mollersuite/tangent/issues")
                    .website("https://github.com/mollersuite/tangent") // for now
                    .build();
                dialog.add_acknowledgement_section(
                    None,
                    &["Molly the Beagle, 2009-2022 🕊️ https://mola.pages.dev"],
                );
                dialog.present()
            }
        }
    }
}

fn main() {
    let app = RelmApp::new("uk.cetera.Tangent");
    app.run::<AppModel>(());
}
