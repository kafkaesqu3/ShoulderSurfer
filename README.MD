# SingleFile

SingleFile is a Web Extension (and a CLI tool) compatible with Chrome, Firefox
(Desktop and Mobile), Microsoft Edge, Vivaldi, Brave, Waterfox, Yandex browser,
and Opera. It helps you to save a complete web page into a single HTML file.

## Table of Contents

- [Demo](#demo)
- [Install](#install)
- [Getting started](#getting-started)
- [Additional notes](#additional-notes)
- [FAQ](#faq)
- [Release notes](#release-notes)
- [Known issues](#known-issues)
- [Troubleshooting unknown issues](#troubleshooting-unknown-issues)
- [Command Line Interface](#command-line-interface)
- [Integration with user scripts](#integration-with-user-scripts)
- [SingleFileZ](#singlefilez)
- [File format comparison](#file-format-comparison)
- [Projects using SingleFile](#projects-using-singlefile)
- [Privacy policy](#privacy-policy)
- [Contributors](#contributors)
- [Icons](#icons)
- [Code derived from third party projects](#code-derived-from-third-party-projects)
- [License](#license)

## Demo

https://user-images.githubusercontent.com/396787/156664907-cc458e35-f41b-45ca-91eb-372213812b44.mp4

## Install

SingleFile can be installed on:

- Firefox: https://addons.mozilla.org/firefox/addon/single-file
- Chrome:
  https://chrome.google.com/extensions/detail/mpiodijhokgodhhofbcjdecpffjipkle
- Microsoft Edge:
  https://microsoftedge.microsoft.com/addons/detail/efnbkdcfmcmnhlkaijjjmhjjgladedno
- Firefox for Android Nightly by following this procedure:
  https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/

You can also download the zip file
(https://github.com/gildas-lormeau/SingleFile/archive/master.zip) of the project
and install it manually by unzipping it somewhere on your disk and following
these instructions:

- Firefox:
  https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
- Chrome: https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked (omit the
  manifest creation)
- Microsoft Edge:
  https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading

## Getting started

- Wait until the page is fully loaded.
- Click on the SingleFile button in the extension toolbar to save the page.
- You can click again on the button to cancel the action when processing a page.

## Additional notes

- Open the context menu by right-clicking the SingleFile button in the extension
  toolbar or on the webpage. It allows you to save:
  - the current tab,
  - the selected content,
  - the selected frame.
- You can also process multiple tabs in one click and save:
  - the selected tabs,
  - the unpinned tabs,
  - all the tabs.
- Select "Annotate and save the page..." in the context menu to:
  - highlight text,
  - add notes,
  - remove content.
- The context menu also allows you to activate the auto-save of:
  - the current tab,
  - the unpinned tabs,
  - all the tabs.
- With auto-save active, pages are automatically saved every time after being
  loaded (or before being unloaded if not).
- Right-click on the SingleFile button and select "Manage extension" (Firefox) /
  "Options" (Chrome) to open the options page.
- Enable the option "Destination > save to Google Drive" or "Destination >
  upload to GitHub" to upload pages to Google Drive or GitHub respectively.
- Enable the option "Misc. > add proof of existence" to prove the existence of
  saved pages by linking the SHA256 of the pages into the blockchain.
- You can use the customizable shortkey Ctrl+Shift+Y to save the current tab or
  the selected tabs. Go to about:addons and select "Manage extension shortcuts"
  in the cogwheel menu to change it in Firefox. Go to
  chrome://extensions/shortcuts to change it in Chrome.
- The default save folder is the download folder configured in your browser, cf.
  about:addons in Firefox and chrome://settings in Chrome.
- See the extension help in the options page for more detailed information about
  the options and technical notes.

## FAQ

See https://github.com/gildas-lormeau/SingleFile/blob/master/faq.md

## Release notes

See https://addons.mozilla.org/firefox/addon/single-file/versions/

## Known Issues

- All browsers:
  - For security reasons, you cannot save pages hosted on
    https://chrome.google.com, https://addons.mozilla.org and some other Mozilla
    domains. When this happens, 🛇 is displayed on top of the SingleFile icon.
  - For
    [security reasons](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image),
    SingleFile is sometimes unable to save the image representation of
    [canvas](https://developer.mozilla.org/docs/Web/HTML/Element/canvas) and
    snapshots of
    [video](https://developer.mozilla.org/docs/Web/HTML/Element/video) elements.
  - The last saved path cannot be remembered by default. To circumvent this
    limitation, disable the option "Misc > save pages in background".
  - The following characters are replaced with `_` in file names: `~`, `+`, `\`,
    `?`, `%`, `*`, `:`, `|`, `"`, `<`, `>`
- Chromium-based browsers:
  - You must enable the option "Allow access to file URLs" in the extension page
    to display the infobar when viewing a saved page, and to save or to annotate
    a page stored on the filesystem.
  - If the file name of a saved page looks like
    "56833935-156b-4d8c-a00f-19599c6513d3.html", disable the option "Misc > save
    pages in background". Reinstalling the browser may also fix this issue. You
    can find more info about this bug
    [here](https://bugs.chromium.org/p/chromium/issues/detail?id=892133).
  - Disabling the option "File name > open the "Save as" dialog to confirm the
    file name" will work if and only if the option "Ask where to save each file
    before downloading" is disabled in chrome://settings/downloads.
- Firefox:
  - The "File name > file name conflict resolution" option does not work if set
    to "prompt for a name"
  - Sometimes, SingleFile is unable to save the contents of sandboxed iframes
    because of [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1411641).
  - When processing a page from the filesystem, external resources (e.g. images,
    stylesheets, fonts etc.) will not be embedded into the saved page. You can
    find more info about this bug
    [here](https://bugzilla.mozilla.org/show_bug.cgi?id=1644488). This bug has
    been closed by Mozilla as "WontFix". But there is a simple workaround
    proposed
    [here](https://github.com/gildas-lormeau/SingleFile/issues/7#issuecomment-618980153).
- Waterfox Classic
  - User interface elements displayed in the page (progress bar, logs panel)
    won't be displayed unless `dom.webcomponents.enabled` is enabled in
    `about:config`.
  - When opening pages saved with the option "Images > group duplicate images
    together" enabled, some duplicate images might not displayed. It is
    recommended to disable this option.

## Troubleshooting unknown issues

Please follow these steps if you find an unknown issue:

- Save the page in incognito.
- If saving page in incognito did not fix the issue, reset SingleFile options.
- If resetting options did not fix the issue, restart the browser.
- If restarting the browser did not fix the issue, try to disable all other
  extensions to see if there is a conflict.
- If there is a conflict then try to determine against which extension(s).
- Please report the issue with a short description on how to reproduce it here:
  https://github.com/gildas-lormeau/SingleFile/issues.

## Command Line Interface

You can save web pages to HTML from the command line interface. See here for
more info:
https://github.com/gildas-lormeau/SingleFile/blob/master/cli/README.MD.

## Integration with user scripts

You can execute a user script just before (and after) SingleFile saves a page.
For more info, see
https://github.com/gildas-lormeau/SingleFile/wiki/How-to-execute-a-user-script-before-a-page-is-saved.

## SingleFileZ

SingleFileZ is a fork of SingleFile that allows you to save a webpage as a
self-extracting HTML file. This HTML file is also a valid ZIP file which
contains the resources (images, fonts, stylesheets and frames) of the saved
page. This ZIP file can be unzipped on the filesystem in order, for example, to
view the page in a browser that would not support pages saved with SingleFileZ.

More info here: https://github.com/gildas-lormeau/SingleFileZ

## File format comparison
|   	                                                                          | HTML (SingleFile)  | HTML (SingleFileZ) | MAFF  | MHTML | Webarchive (Safari) | HTML+folder |
| ---                                	                                          |       :---:        |       :---:        | :---: | :---: |         :---:       |    :---:    |
| Pages are saved as a single file                                              | ✓ 	               | ✓ 	                | ✓     | ✓     | ✓                   |             | 
| HTML and styles are minified                                                  | ✓                  | ✓ 	                |       |       |   	                |             |
| Unused HTML and styles are removed from files                                 | ✓                  | ✓ 	                |       |       |                     |   	         |
| Binary resources are not encoded in base 64                                   |                    | ✓ 	                | ✓     |       | ✓                   | ✓ 	         |
| Files are compressed                                                          |                    | ✓ 	                | ✓     |       |                     |   	         |
| Files can be viewed without installing any extension                          | ✓                  | ✓¹                 |       | ✓²    | ✓³                  | ✓           |
| Files can be viewed without running JavaScript                                | ✓                  |         	          | ✓     | ✓     | ✓                   | ✓ 	         |
| Files can be unzipped to extract resources and view pages                     |                    | ✓ 	                | ✓     |       |                     | n/a         |
| Files contains the text of the page (plain or formatted) which can be indexed | ✓ 	               | ✓⁴                 |       | ✓     | ✓ 	                | ✓ 	         |

Footnotes:

¹ A switch must be passed from the command line in Chromium-based browsers, and
an option must be enabled in Safari.

² Only in Chromium-based browsers, and Internet Explorer.

³ Only in Safari.

⁴ An option must be enabled in the extension.

## Projects using SingleFile

- ArchiveBox - Open-source self-hosted web archiving:
  https://github.com/ArchiveBox/ArchiveBox
- htmls-to-datasette - Tool to index HTML files into a Sqlite database:
  https://github.com/pjamar/htmls-to-datasette
- singlefile2trilium - Tool to save faithful copy of a web page as a Trilium
  note with SingleFile: https://github.com/nil0x42/singlefile2trilium
- SingleFileMacOS - Integration of SingleFile in a swift application using
  webkit: https://github.com/captaindavepdx/SingleFileMacOS
- Zotero Connector - Browser extension for Zotero, a tool to help you collect,
  organize, cite, and share your research sources:
  https://github.com/zotero/zotero-connectors

## Privacy Policy

See https://github.com/gildas-lormeau/SingleFile/blob/master/privacy.md

## Contributors

- Chinese translation done by yfdyh000 (https://github.com/yfdyh000),
  KrasnayaPloshchad (https://github.com/KrasnayaPloshchad), frostblazergit
  (https://github.com/frostblazergit), dnknn (https://github.com/dnknn),
  lqzhgood (https://github.com/lqzhgood)
- Traditional Chinese translation done by frostblazergit
  (https://github.com/frostblazergit), lqzhgood (https://github.com/lqzhgood)
- German translation done by womotroll (https://github.com/womotroll), bannmann
  (https://github.com/bannmann)
- Italian translation done by Fastbyte01 (https://github.com/Fastbyte01)
- Japanese translation done by Shitennouji（四天王寺)
  (https://github.com/Shitennouji)
- Polish translation done by xesarni (https://github.com/xesarni)
- Portuguese-Brazilian translation done by @mezysinc
- Russian translation done by rstp14, kramola-RU
  (https://github.com/kramola-RU), solokot (https://github.com/solokot),
  TotalCaesar659 (https://github.com/TotalCaesar659)
- Ukrainian translation done by perdolka (https://github.com/perdolka)
- Spanish translation done by strel (https://github.com/strel)

## Code derived from third party projects

- csstree: https://github.com/csstree/csstree
- postcss-media-query-parser:
  https://github.com/dryoma/postcss-media-query-parser
- postcss-selector-parser: https://github.com/postcss/postcss-selector-parser
- UglifyCSS: https://github.com/fmarcia/UglifyCSS
- parse-srcset: https://github.com/albell/parse-srcset
- parse-css-font: https://github.com/jedmao/parse-css-font
- Readability: https://github.com/mozilla/readability
- whatwg-mimetype: https://github.com/jsdom/whatwg-mimetype

## Icons

- Icon made by [Kiranshastry](https://www.flaticon.com/authors/kiranshastry)
  from [Flaticon](https://www.flaticon.com/) is licensed by
  [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

## License

SingleFile is licensed under AGPL. Code derived from third-party projects is
licensed under MIT. Please contact me at gildas.lormeau &lt;at&gt; gmail.com if
you are interested in licensing the SingleFile code for a commercial service or
product.

Suggestions are welcome :)
