[![Stories in Ready](https://badge.waffle.io/BitClip/BitClip.png?label=ready&title=Ready)](https://waffle.io/BitClip/BitClip)

#BitClip:
### The most easy-to-use client-side Bitcoin wallet on the internet.

# Just got into Bitcoin and need a secure, light-weight wallet?

Download BitClip!
We got tired of clunky wallets with a bazillion form fields. 
We built BitClip to give you a safe way to store and spend Bitcoins without the clutter:
  - All private keys managed client-side
  - Encrypted storage of address-key pairs
  - Encrypted propagation of transactions through HelloBlock API
  - Testnet support (Testnet addresses come preloaded with Bitcoins)

Soon to be released:
  - Backup
  - Import/Export address-key pairs


## Team

  - __Product Owner__: Jack Tan Lu
  - __Scrum Master__: Etienne Tripier
  - __Development Team Members__: Austin Connelly, Issaq Al-Ahmed

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    a. [Installing Dependencies](#installing-dependencies)
    b. [Tasks](#tasks)
4. [Team](#team)
5. [Contributing](#contributing)

## Usage

You can download a working version of this App [here](https://chrome.google.com/webstore/category/apps).


## Requirements

- BitcoinJS 1.0.2
- HelloBlock 1.0.0
- AngularJS ~1.2.25,
- Nvd3 ~1.1.15-beta,
- ngFx ~1.0.4

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Tasks


1. Visit chrome://extensions in your browser (or open up the Chrome menu by clicking the icon to the far right of the URL box and select Extensions under the Tools menu to get to the same place).

2. Ensure that the Developer mode checkbox in the top right-hand corner is checked.

3. Click Load unpacked extension to pop up a file-selection dialog.

4. Navigate to the 'client' directory of BitClip (path/BitClip_Directory/client)

5. Click Select on 'client' directory, and BitClip will be loaded into your Browser.


### Roadmap

View the project roadmap [here](https://docs.google.com/spreadsheets/d/1-yMgsi_L0hib9ap5ruJHyLoarVNYoiJXBJx6AYjVb3U/)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
