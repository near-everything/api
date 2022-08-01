<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/near-everything/api">
    <img src="images/everything.png" alt="Logo" width="80" height="80">
  </a>

<h2 align="center">everything api</h3>

  <p align="center">
    The GraphQL API to the inventory of everything.
    <br />
    <!-- <a href="https://documentation.everything.dev"><strong>Explore the docs »</strong></a> -->
    <!-- <br /> -->
    <br />
    <a href="https://everything.dev">Use App</a>
    ·
    <a href="https://github.com/near-everything/api/issues">Report Bug</a>
    ·
    <a href="https://github.com/near-everything/api/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
The everything api is the interface of the [inventory of everything](https://everything.dev): a centralized database of real, tangible assets that can then be used as the foundation for decentralized marketplaces, services, tools-- in the effort to create a circular economy that makes sense for everyone.


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* docker >= 17.12.0+
* docker-compose

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/near-everything/api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start docker (this will start PostgreSQL database, pgAdmin, and firebase emulators for authentication and storage)
    ```
      docker-compose up -d
      ```
      


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Run the app in development mode:

```sh
 npm start
 ```
Access to graphiql:
* `http://localhost:4050/graphiql`

Access to postgres: 
* `localhost:5432`
* **Username:** postgres (as a default)
* **Password:** changeme (as a default)

Access to PgAdmin: 
* **URL:** `http://localhost:5050`
* **Username:** pgadmin4@pgadmin.org (as a default)
* **Password:** admin (as a default)

<br/>
_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] TBD...

See the [open issues](https://github.com/near-everything/api/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Elliot Braem - elliot@everything.dev


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* Postgres, PgAdmin, docker setup referenced from [compose-postgres](https://github.com/khezen/compose-postgres/pull/23/files).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/near-everything/api.svg?style=for-the-badge
[contributors-url]: https://github.com/near-everything/api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/near-everything/api.svg?style=for-the-badge
[forks-url]: https://github.com/near-everything/api/network/members
[stars-shield]: https://img.shields.io/github/stars/near-everything/api.svg?style=for-the-badge
[stars-url]: https://github.com/near-everything/api/stargazers
[issues-shield]: https://img.shields.io/github/issues/near-everything/api.svg?style=for-the-badge
[issues-url]: https://github.com/near-everything/api/issues
[license-shield]: https://img.shields.io/github/license/near-everything/api.svg?style=for-the-badge
[license-url]: https://github.com/near-everything/api/blob/main/LICENSE.txt
[product-screenshot]: images/screenshot.png
