/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import _ from "lodash";
import { Button } from "@chakra-ui/react";
import { useAccount, useDisconnect } from "wagmi";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  HStack,
  Box,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { FiKey, FiChevronDown, FiXCircle } from "react-icons/fi";
import { truncateAddress } from "../utils/general";
import Link from "./ChakraNextLink";

const ConnectWallet: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const showNetwork = false; // maybe unhide, in some cases

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="outline"
                    transition="all 100ms ease-in-out"
                    leftIcon={
                      <Icon as={FiKey} color="primary.500" w="20px" h="20px" />
                    }
                    onClick={openConnectModal}
                    data-cy="connect-wallet"
                  >
                    Connect
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="outline">
                    Unsupported network
                  </Button>
                );
              }

              return (
                <Flex gap={3}>
                  <Menu
                    offset={[0, 4]}
                    placement="bottom-end"
                    autoSelect={false}
                  >
                    {showNetwork && (
                      <Button
                        variant="outline"
                        width="fit"
                        onClick={openChainModal}
                      >
                        <Image
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          width={25}
                          height={25}
                          mr={2}
                        />
                        {chain.name}
                      </Button>
                    )}

                    <MenuButton as={Button} variant="outline" width="fit">
                      <HStack spacing={3}>
                        <Text color="white">
                          {account.ensName
                            ? account.ensName
                            : truncateAddress(account.address)}
                        </Text>
                        <Icon as={FiChevronDown} color="primary.500" />
                      </HStack>
                    </MenuButton>
                    <MenuList minWidth="none">
                      <MenuItem
                        onClick={() => openAccountModal()}
                        _hover={{ backgroundColor: "gray.600" }}
                      >
                        <HStack>
                          <Icon as={FiKey} color="white" />
                          <Box color="white">Wallet</Box>
                        </HStack>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
