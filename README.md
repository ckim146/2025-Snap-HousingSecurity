

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ckim146/2025-Snap-HousingSecurity">
    <img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/5ff03eed-02ff-481f-8018-52dc60bd1bbe" />

  </a>

<h3 align="center">Home Base</h3>

  <p align="center">
    Home Base is a SnapChat subfeature that provides organizations a platform organizations to share resources and events with users through categorized, swipeable card stacks.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is a cross-platform mobile application designed to help organizations extend their outreach by sharing resources and events with users in an accessible, categorized format. Each organization can create and manage entries such as workshops, support groups, educational materials, and community events—through the app’s backend, which stores data in a Supabase-powered PostgreSQL database.

Entries are enriched with metadata including title, description, date, type, and location.  The mobile client fetches these entries, groups them dynamically by type, and presents them in swipeable card stacks for an intuitive, engaging browsing experience.

The platform’s design emphasizes:

- Categorized presentation — Entries are automatically grouped by their “type” field, making it easier for users to navigate.

- Interactive browsing — Swipeable card stacks encourage quick exploration of available resources and events. Users can tap on the address of the event listed on the event description to be directed to the location on the Snap Maps tab.

- Organizational scalability — The schema supports multiple organizations, allowing each to manage its own outreach materials independently while sharing a unified interface.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With 
(*Note: scroll down in the markdown view of this readme to configure the syntax and switch out tech stacks.)

- [![React][React.js]][React-url]
- [![Expo][Expo.dev]][Expo-url]
- [![Supabase][Supabase.com]][Supabase-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Clone the repository

### Installation

Install dependancies

- npm
  ```sh
  npm install
  ```
- npx
  ```sh
  npx expo install
  ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>


##  Add Supabase Environment Variable!

You'll need to create and add your own `.env` file with your supabase key.

<!-- USAGE EXAMPLES -->

<!--## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

<!--## License

Distributed under the project_license. See `LICENSE.txt` for more information.-->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Expo.dev]: https://img.shields.io/badge/Expo-000000?logo=Expo&logoColor=white
[Expo-url]: https://expo.dev/
[Supabase.com]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
