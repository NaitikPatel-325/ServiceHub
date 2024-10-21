import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { Avatar } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";

interface CustomNavLinkProps {
  to: string;
  className: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Add onClick prop type
}

const CustomNavLink: React.FC<CustomNavLinkProps> = ({
  to,
  className,
  activeClassName,
  children,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <NavLink to={to} className={isActive ? activeClassName : className} onClick={handleClick}>
      <p className="text-2xl">{children}</p>
    </NavLink>
  );
};

export default function Nav({ toggleLogin, isLoggedIn, routes, user }: any) {
  const dispatch = useDispatch();

  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure();

  const {
    isOpen: isOpenReg,
    onOpen: onOpenReg,
    onClose: onCloseReg,
  } = useDisclosure();

    const logout = async () => {
      try {
        const response = await axios.post("http://localhost:3000/user/logout",{}, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          dispatch({ type: "CLEAR_USER" }); 
          toast.success("Logged out successfully"); 
          toggleLogin(); 
        } else {
          toast.error("Logout failed. Please try again.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("An error occurred during logout. Please try again.");
      }
    };
  

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("http://localhost:3000/user/check", {
          withCredentials: true,
        });
        if (res.data) {
          dispatch({ type: "SET_USER", payload: res.data.data.user });
          toggleLogin();
        }
      } catch (error) {
        console.log(error);
      }
    }

    loadUser();
  }, []);

  const Profile = () => {
    window.location.href = "/profile";
  };

  return (
    <div>
      <nav className="border-b border-gray-800 fixed w-full z-20 top-0 start-0 glassy-effect-navbar">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto md:p-4 p-1">
          <CustomNavLink
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="text-white font-semibold text-4xl dark:text-white">
              ServiceHub
            </span>
          </CustomNavLink>

          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {!isLoggedIn && (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg md:text-sm text-sm md:px-4 md:py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 px-2"
                onClick={onOpenLogin}
              >
                Login/Register
                <Login
                  isOpen={isOpenLogin}
                  onClose={onCloseLogin}
                  onOpenRegister={onOpenReg}
                  toggleLogin={toggleLogin}
                />
                <Register
                  isOpen={isOpenReg}
                  onClose={onCloseReg}
                  onOpenLogin={onOpenLogin}
                />
              </button>
            )}
            {isLoggedIn && (
              <Menu>
                <MenuButton className="border-2 border-white-500 rounded-full">
                  <Avatar
                    name={user?.name || "User"}
                    src={user?.avatar || ""}
                    size={"sm"}
                  />
                </MenuButton>
                <MenuList bg={"gray.900"}>
                  <CustomNavLink
                    className=""
                    activeClassName="text-blue-400"
                    to="/profile"
                  >
                    <MenuItem bg={"gray.900"}>{user?.name}</MenuItem>
                  </CustomNavLink>
                  <MenuItem onClick={Profile} bg={"gray.900"}>
                    <span>Profile</span>
                  </MenuItem>
                  <MenuItem onClick={logout} bg={"gray.900"}>
                    <span className="text-red-500">Logout</span>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            <div className="block md:hidden my-auto">
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  bg={"gray.300"}
                  _hover={{ bg: "gray.400" }}
                  _active={{ bg: "gray.500" }}
                  _focus={{ bg: "gray.500" }}
                />
                <MenuList bg={"gray.900"}>
                  {routes.map((route: any, index: any) => (
                    <MenuItem key={index} bg={"gray.900"}>
                      <CustomNavLink
                        to={route.path}
                        className=""
                        activeClassName="text-blue-500"
                      >
                        {route.name}
                      </CustomNavLink>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          </div>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 m">
  {routes.map((route: any, index: any) => (
    <li key={index}>
      {route.name !== "home" ? (
        <CustomNavLink
          to={route.path}
          className="text-white hover:text-blue-400 font-semibold"
          activeClassName="text-blue-400 font-semibold"
          onClick={(event) => {
            if (!isLoggedIn) {
              event.preventDefault(); 
              toast.error("You must be logged in to access this page!", {
                duration: 3000,
              });
            }
          }}
        >
          {route.name}
        </CustomNavLink>
      ) : (
        <CustomNavLink
          to={route.path}
          className="text-white hover:text-blue-400 font-semibold"
          activeClassName="text-blue-400 font-semibold"
        >
          {route.name}
        </CustomNavLink>
      )}
    </li>
  ))}
</ul>

          </div>
        </div>
      </nav>
    </div>
  );
}
